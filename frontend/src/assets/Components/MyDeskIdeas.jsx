import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyIdeas, createIdea, toggleVote } from '../../services/ideasService';
import { getMyGroups } from '../../services/groupsService';
import { ThumbsUp, MessageSquare, Send } from 'lucide-react';

// Simple Idea Card for MyDesk
const IdeaCard = ({ idea, onLike, onShare }) => (
  <div className="bg-white rounded-lg p-4 shadow mb-4">
    <div className="flex items-start justify-between">
      <div>
        <div className="font-medium text-lg">{idea.title || 'Untitled'}</div>
        <div className="text-sm text-gray-700 mt-2">{idea.content}</div>
        <div className="flex items-center gap-3 mt-3 text-sm text-gray-600">
          <button onClick={() => onLike(idea.id)} className={`flex items-center gap-1 ${idea.liked ? 'text-yellow-400' : ''}`}>
            <ThumbsUp className="w-4 h-4" /> <span>{idea.likes || 0}</span>
          </button>
          <div className="flex items-center gap-1">
            <MessageSquare className="w-4 h-4" /> <span>{idea.replies || 0} replies</span>
          </div>
        </div>
      </div>
      <div className="ml-4 flex flex-col items-end">
        <div className="text-xs text-gray-500">{idea.time || ''}</div>
        <button onClick={() => onShare && onShare(idea)} className="mt-3 px-3 py-1 bg-gray-100 rounded text-sm">Share</button>
      </div>
    </div>
  </div>
);

export default function MyDeskIdeas() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('');
  const [shareOpen, setShareOpen] = useState(false);
  const [shareIdea, setShareIdea] = useState(null);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    setLoading(true);
    try {
      const data = await getMyIdeas();
      setIdeas(data || []);
    } catch (e) {
      console.error('Failed to load personal ideas', e);
    } finally {
      setLoading(false);
    }
  }

  async function handlePost() {
    if (!title.trim() && !content.trim()) return;
    const payload = { title: title.trim(), content: content.trim(), tag: tag || null, groupID: null };
    try {
      await createIdea(payload);
      setTitle('');
      setContent('');
      setTag('');
      refresh();
    } catch (e) {
      console.error('Failed to create personal idea', e);
    }
  }

  async function handleLike(ideaId) {
    try {
      await toggleVote(ideaId);
      refresh();
    } catch (e) {
      console.error('Failed to toggle vote', e);
    }
  }

  async function openShare(idea) {
    setShareIdea(idea);
    setShareOpen(true);
    try {
      const g = await getMyGroups();
      setGroups(g || []);
    } catch (e) {
      console.error('Failed to load groups', e);
    }
  }

  function confirmShare() {
    if (!selectedGroup || !shareIdea) return;
    // navigate to Collab ideas with selectedGroup and prefill so user must press Send to post
    navigate('/home-page/Collab/ideas', { state: { selectedGroup, prefill: { title: shareIdea.title, content: shareIdea.content, tag: shareIdea.tag } } });
  }

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-2xl font-semibold">My Ideas</h3>
        <p className="text-sm text-gray-600">Personal ideas stored only for you. Share to a group when ready.</p>
      </div>

      <div className="mb-6">
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full mb-2 px-3 py-2 rounded border" />
        <textarea placeholder="Describe your idea..." value={content} onChange={(e) => setContent(e.target.value)} className="w-full mb-2 px-3 py-2 rounded border" rows={4} />
        <input placeholder="Tag (optional)" value={tag} onChange={(e) => setTag(e.target.value)} className="w-48 mb-2 px-3 py-2 rounded border" />
        <div className="flex gap-3 mt-2">
          <button onClick={handlePost} className="px-4 py-2 bg-purple-500 text-white rounded">Post</button>
        </div>
      </div>

      <div>
        {loading ? <div className="text-sm text-gray-600">Loading...</div> : (
          ideas.length === 0 ? <div className="text-sm text-gray-600">No personal ideas yet.</div> : (
            ideas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} onLike={handleLike} onShare={openShare} />
            ))
          )
        )}
      </div>

      {/* Share modal (simple) */}
      {shareOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-[520px]">
            <h4 className="text-lg font-semibold mb-3">Share to a group</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto mb-4">
              {groups.map((g) => (
                <label key={g.groupId} className={`w-full flex items-center justify-between p-2 border rounded ${selectedGroup?.groupId === g.groupId ? 'bg-gray-100' : ''}`}>
                  <div>
                    <div className="font-medium">{g.name}</div>
                    <div className="text-xs text-gray-600">{g.description || ''}</div>
                  </div>
                  <input type="radio" name="group" checked={selectedGroup?.groupId === g.groupId} onChange={() => setSelectedGroup(g)} />
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShareOpen(false)} className="px-3 py-2 rounded border">Cancel</button>
              <button onClick={() => { confirmShare(); setShareOpen(false); setShareIdea(null); setSelectedGroup(null); }} className="px-3 py-2 bg-purple-500 text-white rounded">Go to Collab</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
