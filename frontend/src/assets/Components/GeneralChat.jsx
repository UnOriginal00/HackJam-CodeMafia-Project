import React, { useState, useRef, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

export default function GeneralChat() {
  import React, { useState, useRef, useEffect } from 'react';
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

    // helper to map backend DTO to UI message
    function mapDtoToMsg(dto) {
      return {
        id: dto.MessageID ?? dto.messageID ?? dto.id ?? Date.now(),
        userId: dto.UserID ?? dto.userId ?? dto.userId,
        author: dto.Name || dto.name || dto.Surname || dto.surname ? `${dto.Name || dto.name || ''} ${dto.Surname || dto.surname || ''}`.trim() : 'Unknown',
        text: dto.MessageText ?? dto.messageText ?? dto.Message ?? dto.message ?? '',
        createdAt: dto.CreatedAt ?? dto.createdAt ?? null
      };
    }

    // scroll to bottom when messages change
    useEffect(() => {
      if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
    }, [messages]);

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
          setMessages(mapped);
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
          UserID: created.UserID ?? created.userID ?? myUserId,
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
    const myUserId = myProfile?.userId || myProfile?.UserId || myProfile?.id || null;

    return (
      <div className="relative">
        <div className="p-4">
          <h2 className="text-2xl font-semibold mb-4">General Chat</h2>
        </div>

        <div ref={msgsRef} className="overflow-y-auto space-y-3 p-4 bg-white rounded shadow max-h-[60vh] mb-6" style={{ maxHeight: 'calc(100vh - 260px)' }}>
          {messages.map(m => (
            <div key={m.id} className={`p-3 rounded-md max-w-[720px] min-w-[320px] ${m.userId === myUserId ? 'ml-auto bg-gradient-to-r from-purple-500 to-purple-600 text-white' : 'bg-gray-100 text-black'}`}>
              <div className="text-sm font-medium">{m.author || (m.userId === myUserId ? 'You' : 'Unknown')}</div>
              <div className="text-sm whitespace-pre-wrap">{m.text}</div>
              {m.createdAt && <div className="text-xs text-gray-400 mt-1">{new Date(m.createdAt).toLocaleString()}</div>}
            </div>
          ))}
        </div>

        {/* Composer fixed to viewport bottom, aligned right of sidebar */}
        <div className="fixed bottom-0 left-[339px] right-0 z-50">
          <div className="max-w-[1100px] mx-auto px-6">
            <div className="bg-white/95 backdrop-blur-md border-t border-gray-200 p-4 rounded-t-xl shadow-lg">
              <div className="flex gap-4 items-center">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) send(); }}
                  className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  placeholder={selectedGroup ? 'Type a message...' : 'Select a group to chat'}
                  disabled={!selectedGroup}
                  aria-label="Chat message"
                />
                <button onClick={send} disabled={sending || !selectedGroup} className="w-24 h-12 bg-purple-500 text-white rounded-lg flex items-center justify-center hover:bg-purple-600 transition disabled:opacity-50">
                  {sending ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Send'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
