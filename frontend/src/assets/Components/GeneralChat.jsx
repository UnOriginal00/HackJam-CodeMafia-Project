import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { getHistory, sendMessage as apiSendMessage } from '../../services/chatService';

export default function GeneralChat() {
  const outlet = useOutletContext ? useOutletContext() : null;
  const selectedGroup = outlet?.selectedGroup ?? null;

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const msgsRef = useRef(null);
  const pollRef = useRef(null);
  const composerRef = useRef(null);
  const [composerHeight, setComposerHeight] = useState(0);

    // helper to map backend DTO to UI message
    function mapDtoToMsg(dto) {
      return {
        id: dto.MessageID ?? dto.messageID ?? dto.id ?? Date.now(),
        // normalize userId to a Number to avoid type-equality issues
        userId: Number(dto.UserID ?? dto.userId ?? dto.user ?? 0),
        author: dto.Name || dto.name || dto.Surname || dto.surname ? `${dto.Name || dto.name || ''} ${dto.Surname || dto.surname || ''}`.trim() : 'Unknown',
        text: dto.MessageText ?? dto.messageText ?? dto.Message ?? dto.message ?? '',
        createdAt: dto.CreatedAt ?? dto.createdAt ?? null
      };
    }

    // scroll to bottom when messages change
    useEffect(() => {
      if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
    }, [messages]);

    // measure composer height so messages container can add bottom padding
    useEffect(() => {
      function updateHeight() {
        const h = composerRef.current ? composerRef.current.offsetHeight : 0;
        setComposerHeight(h);
      }

      updateHeight();
      window.addEventListener('resize', updateHeight);
      return () => window.removeEventListener('resize', updateHeight);
    }, []);

    // load history when group changes and start polling
    useEffect(() => {
      let mounted = true;

      async function load() {
        if (!selectedGroup) {
          setMessages([]);
          return;
        }

        try {
          const data = await getHistory(selectedGroup.groupId);
          if (!mounted) return;
          const mapped = (data || []).map(mapDtoToMsg);

          // Delta-sync with reconciliation:
          // - If we have no messages yet (initial load or group changed), replace with server data
          // - Otherwise, try to reconcile server messages with optimistic messages by matching
          //   userId + trimmed text + small time window (10s). If matched, replace the optimistic
          //   message with the server authoritative message. Otherwise append new messages.
          setMessages(prev => {
            if (!prev || prev.length === 0) return mapped;

            const existingById = new Map(prev.map(m => [m.id, m]));

            const toAdd = [];
            const replacedIndexes = new Map();

            const parseTime = (t) => {
              try { return t ? new Date(t).getTime() : null; } catch { return null; }
            };

            for (const srv of mapped) {
              if (existingById.has(srv.id)) continue; // server msg already present

              // try to find optimistic match: same user, same text, createdAt within 10s
              const srvText = (srv.text || '').toString().trim();
              const srvTime = parseTime(srv.createdAt);

              let matchedIndex = -1;
              if (srvText) {
                for (let i = 0; i < prev.length; i++) {
                  const p = prev[i];
                  if (p.userId === srv.userId && (p.text || '').toString().trim() === srvText) {
                    const pTime = parseTime(p.createdAt);
                    // accept if both times exist and are within 10 seconds, or if either is missing accept match
                    const withinWindow = (pTime && srvTime) ? Math.abs(pTime - srvTime) <= 10000 : true;
                    if (withinWindow) { matchedIndex = i; break; }
                  }
                }
              }

              if (matchedIndex >= 0) {
                replacedIndexes.set(matchedIndex, srv);
              } else {
                toAdd.push(srv);
              }
            }

            if (replacedIndexes.size === 0 && toAdd.length === 0) return prev;

            // build new array with replacements applied
            const next = prev.slice();
            for (const [idx, srv] of replacedIndexes.entries()) next[idx] = srv;

            // append new server messages that didn't match
            return [...next, ...toAdd];
          });
        } catch (err) {
          console.error('Failed to load chat history', err);
        }
      }

      // initial load
      load();

      // polling every 2500ms
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = setInterval(() => {
        load();
      }, 2500);

      return () => {
        mounted = false;
        if (pollRef.current) clearInterval(pollRef.current);
      };
    }, [selectedGroup]);

    const send = async () => {
      if (!text.trim() || !selectedGroup) return;
      setSending(true);
      const profile = JSON.parse(localStorage.getItem('jwt_profile') || 'null') || {};
      const myUserId = profile?.userId || profile?.userId || profile?.UserId || profile?.id || null;

      try {
        const created = await apiSendMessage({ groupID: selectedGroup.groupId, userID: myUserId, messageText: text.trim() });

        // backend returns Chat_History (no Name/Surname), so augment with profile name for immediate display
        const display = {
          MessageID: created.MessageID ?? created.messageID ?? created.messageId ?? Date.now(),
          // ensure UserID is numeric
          UserID: Number(created.UserID ?? created.userID ?? myUserId),
          Name: profile?.name || profile?.Name || profile?.fullName || '',
          Surname: profile?.surName || profile?.surname || profile?.Surname || '',
          MessageText: created.MessageText ?? created.messageText ?? text.trim(),
          CreatedAt: created.CreatedAt ?? created.createdAt ?? new Date().toISOString()
        };

        setMessages(prev => [...prev, mapDtoToMsg(display)]);
        setText('');
      } catch (err) {
        console.error('Failed to send message', err);
        // Optionally show toast / ui error
      } finally {
        setSending(false);
      }
    };

    // convenience: display name resolution for message bubble alignment
  const myProfile = JSON.parse(localStorage.getItem('jwt_profile') || 'null') || {};
  const myUserId = Number(myProfile?.userId ?? myProfile?.UserId ?? myProfile?.id ?? 0) || null;

  return (
    <div className="relative">

      {/*
        Messages container: make room for the fixed composer at the bottom by
        reducing the max-height and adding padding-bottom. This ensures the
        last message isn't hidden behind the input and the scroll reaches the
        visible bottom of the page.
      */}
      <div
        ref={msgsRef}
        className="overflow-y-auto space-y-3 p-4 bg-white rounded max-h-[60vh] mb-6"
        // add extra 100px to ensure messages sit lower (per user request)
        style={{ maxHeight: 'calc(100vh - 120px)', paddingBottom: `${composerHeight + 100}px` }}
      >
        {messages.map(m => (
          <div key={m.id} className={`${m.userId === myUserId ? 'flex justify-end' : 'flex justify-start'}`}>
            <div className="max-w-[720px] min-w-[320px]">
              {/* header: author + date */}
              <div className={`text-sm font-medium ${m.userId === myUserId ? 'text-right text-purple-600' : 'text-left text-gray-700'}`}>
                {m.author || (m.userId === myUserId ? 'You' : 'Unknown')}
                {m.createdAt && (
                  <span className="text-xs text-gray-400 ml-2">{new Date(m.createdAt).toLocaleString()}</span>
                )}
              </div>

              {/* message text block (no drop shadow) */}
              <div className={`mt-1 px-3 py-2 rounded-md ${m.userId === myUserId ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white' : 'bg-gray-100 text-black'}`}>
                <div className="whitespace-pre-wrap">{m.text}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Composer fixed to viewport bottom, aligned right of sidebar */}
  <div ref={composerRef} className="fixed bottom-0 left-[339px] right-0 z-50">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="bg-white/95 backdrop-blur-md border-t border-gray-200 p-4 rounded-t-xl shadow-lg">
            <div className="flex gap-4 items-center">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder={selectedGroup ? 'Type a message...' : 'Select a group to chat'}
                disabled={!selectedGroup}
                aria-label="Chat message"
              />
              <button onClick={send} disabled={sending || !selectedGroup} className="w-12 h-12 bg-purple-500 text-white rounded-lg flex items-center justify-center hover:bg-purple-600 transition disabled:opacity-50" aria-label="Send message">
                {sending ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
