// CollaborationIdeas.jsx - COMPLETE VERSION
// Replace: frontend/src/assets/Components/CollaborationIdeas.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useOutletContext } from 'react-router-dom';
import { Search, Bell, User, FileText, Lightbulb, MessageSquare, Settings, ThumbsUp, Plus, Send } from 'lucide-react';
import { getAllIdeas, createIdea, toggleVote, getMyIdeas } from '../../services/ideasService';
import { getMyGroups } from '../../services/groupsService';

// Avatar Component
const Avatar = ({ initials, size = 'md' }) => {
  const sizes = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-14 h-14 text-xl'
  };

  return (
    <div className={`${sizes[size]} rounded-full bg-gray-200 border border-gray-400 flex items-center justify-center font-normal text-gray-700`}>
      {initials}
    </div>
  );
};

// Team Avatar Component
const TeamAvatar = ({ emoji, size = 'md' }) => {
  const sizes = {
    sm: 'w-10 h-10 text-xl',
    md: 'w-14 h-14 text-2xl',
    lg: 'w-16 h-16 text-3xl'
  };
  
  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-white shadow flex items-center justify-center`}>
      {emoji}
    </div>
  );
};

// Button Component
const Button = ({ children, variant = 'primary', onClick, className = '' }) => {
  const variants = {
    primary: 'bg-purple-400 hover:bg-purple-500 text-white',
    secondary: 'bg-orange-400 hover:bg-orange-500 text-white',
    gradient: 'bg-gradient-to-r from-orange-400 to-purple-400 hover:opacity-90 text-white'
  };
  
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded font-medium transition ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// Tag Badge Component
const TagBadge = ({ tag }) => (
  <span className="px-4 py-1 rounded-full text-xs font-normal text-black" style={{
    background: 'linear-gradient(317.49deg, rgba(246, 157, 75, 0.9) 23.12%, rgba(206, 168, 163, 0.9) 30.11%, rgba(166, 179, 250, 0.9) 40.46%, rgba(189, 181, 253, 0.9) 55.21%)'
  }}>
    {tag}
  </span>
);

// Input Component
const Input = ({ placeholder, value, onChange, onKeyPress, className = '' }) => (
  <input
    type="text"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    onKeyPress={onKeyPress}
    className={`px-4 py-3 bg-gray-200/50 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-purple-400 font-light text-lg ${className}`}
  />
);

// Idea Card Component (supports chat-style alignment via isMine)
const IdeaCard = ({ idea, onLike, onShare, allowShare }) => {
  const isMine = !!idea.isMine;
  const containerClass = isMine ? 'justify-end' : 'justify-start';
  const bubbleClass = isMine
    ? 'bg-gradient-to-r from-purple-500 to-purple-700 text-white'
    : 'bg-white text-gray-900';

  return (
    <div className={`w-full flex ${containerClass}`}>
  <div className={`max-w-[720px] w-auto min-w-[550px] ${isMine ? 'ml-8' : 'mr-8'}`}>
        <div className={`rounded-[20px] p-6 shadow ${bubbleClass}`}> 
          <div className="flex items-center justify-between mb-2">
            <h3 className={`text-xl font-normal ${isMine ? 'text-white' : ''}`}>{idea.title}</h3>
            <TagBadge tag={idea.tag} />
          </div>
          <div className="w-full h-[1px] bg-black/10 mb-3"></div>
          <p className={`mb-4 leading-relaxed font-normal ${isMine ? 'text-white' : 'text-gray-800'}`}>{idea.content}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-gray-600">
              <button 
                onClick={() => onLike(idea.id)}
                className={`flex items-center gap-2 hover:text-gray-900 transition ${idea.liked ? 'text-yellow-300' : ''}`}
                aria-label="Like idea"
              >
                <ThumbsUp className={`w-5 h-5 ${idea.liked ? 'fill-current' : ''}`} />
                <span className="text-sm">{idea.likes}</span>
              </button>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                <span className="text-sm">{idea.replies} replies</span>
              </div>
              {allowShare && isMine && (
                <div>
                  <button onClick={() => onShare && onShare(idea)} className="ml-3 px-3 py-1 bg-white/90 rounded text-sm border hover:bg-white">Share</button>
                </div>
              )}
            </div>
            <div className={`text-sm ${isMine ? 'text-white/80' : 'text-gray-600'}`}>{idea.time}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sidebar Menu Item Component
const SidebarMenuItem = ({ icon: Icon, title, description, active = false, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full bg-white/70 rounded-lg p-4 flex items-start gap-3 hover:bg-white/90 transition ${active ? 'border-3 border-purple-600' : ''}`}
  >
    <Icon className="w-8 h-8 flex-shrink-0 text-black" />
    <div className="text-left">
      <div className="font-normal text-lg text-black">{title}</div>
      <div className="text-sm text-gray-800">{description}</div>
    </div>
  </button>
);

// Main Component
export default function CollaborationIdeas(props) {
  const navigate = useNavigate();
  
  const [ideas, setIdeas] = useState([]);
  // prefer selectedGroup passed from layout (props), otherwise use local state
  const [localSelectedGroup, setLocalSelectedGroup] = useState(null);
  const outlet = useOutletContext ? useOutletContext() : null;
  const selectedGroup = props.selectedGroup ?? outlet?.selectedGroup ?? localSelectedGroup;
  const setSelectedGroup = props.setSelectedGroup ?? outlet?.setSelectedGroup ?? setLocalSelectedGroup;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const ideasContainerRef = useRef(null);
  const location = useLocation();

  const isPersonalView = props.allowShare && !selectedGroup;

  // personal ideas state (when on MyDesk)
  const [personalIdeas, setPersonalIdeas] = useState([]);

  const [newIdeaTitle, setNewIdeaTitle] = useState('');
  const [newIdeaContent, setNewIdeaContent] = useState('');
  const [newIdeaTag, setNewIdeaTag] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  // Share flow state
  const [shareOpen, setShareOpen] = useState(false);
  const [shareIdea, setShareIdea] = useState(null);
  const [myGroups, setMyGroups] = useState([]);
  const [selectedShareGroup, setSelectedShareGroup] = useState(null);

  // Fetch ideas whenever selectedGroup changes. Also accept a group passed via navigation state
  useEffect(() => {
    // Do not auto-set selectedGroup from navigation state to avoid resurrecting selection when
    // navigating back to the group list. Selection should be managed by CollabLayout / outlet context.
    if (isPersonalView) fetchPersonalIdeas();
    else fetchIdeas();
  }, [selectedGroup]);

  const fetchPersonalIdeas = async () => {
    try {
      setLoading(true);
      const data = await getMyIdeas();

      // transform similar to group ideas
      const profile = JSON.parse(localStorage.getItem('jwt_profile') || '{}');
      const currentUserId = profile?.userId ?? profile?.id ?? null;

      const transformed = (data || []).map(idea => {
        const id = idea.id || idea.ideaId || idea.IdeaId || idea.IdeaID || null;
        const createdAt = idea.createdAt || idea.CreatedDate || idea.createdDate || null;
        const title = idea.title || idea.Title || '';
        const content = idea.content || idea.Content || '';
        const authorId = idea.userId || idea.user_id || idea.authorId || null;
        const author = idea.userInitials || idea.userName?.split(' ').map(n => n[0]).join('') || (authorId ? String(authorId) : 'U');
        const isMine = authorId && currentUserId && String(authorId) === String(currentUserId);

        return {
          id,
          author,
          authorId,
          isMine,
          title,
          content,
          tag: idea.tag || 'General',
          likes: idea.voteCount || idea.upVotes || 0,
          replies: idea.replyCount || 0,
          time: createdAt ? new Date(createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '',
          liked: idea.userHasVoted || false
        };
      });

      setPersonalIdeas(transformed.reverse());
      setError(null);
    } catch (err) {
      console.error('Failed to fetch personal ideas:', err);
      setError('Failed to load personal ideas.');
      setPersonalIdeas([]);
    } finally {
      setLoading(false);
    }
  };

  // If navigation state contains a prefill, populate composer (used when sharing from MyDesk)
  useEffect(() => {
    if (location && location.state && location.state.prefill) {
      const p = location.state.prefill;
      if (p.title) setNewIdeaTitle(p.title || '');
      if (p.content) setNewIdeaContent(p.content || '');
      if (p.tag) setNewIdeaTag(p.tag || '');

      // clear the navigation state so it doesn't reapply on back/refresh
      try { window.history.replaceState({}, document.title, window.location.pathname + window.location.search); } catch (e) {}
    }
  }, []);

  const fetchIdeas = async () => {
    try {
      setLoading(true);
      // do not fetch if there is no selected group
      if (!selectedGroup) {
        setIdeas([]);
        setLoading(false);
        return;
      }
      const data = await getAllIdeas(selectedGroup.groupId);
      
      // Transform backend data to match our component structure
      // determine current user id from stored profile
      let currentUserId = null;
      try {
        const profile = JSON.parse(localStorage.getItem('jwt_profile') || '{}');
        currentUserId = profile?.userId ?? profile?.id ?? null;
      } catch (e) {
        currentUserId = null;
      }

      const transformedIdeas = data.map(idea => {
        const id = idea.id || idea.ideaId || idea.IdeaId || idea.IdeaID || null;
        const createdAt = idea.createdAt || idea.CreatedDate || idea.createdDate || null;
        const title = idea.title || idea.Title || '';
        const content = idea.content || idea.Content || '';
        const authorId = idea.userId || idea.user_id || idea.authorId || null;
        const author = idea.userInitials || idea.userName?.split(' ').map(n => n[0]).join('') || (authorId ? String(authorId) : 'U');
        const isMine = authorId && currentUserId && String(authorId) === String(currentUserId);

        return {
          id,
          author,
          authorId,
          isMine,
          title,
          content,
          tag: idea.tag || 'General',
          likes: idea.voteCount || idea.upVotes || 0,
          replies: idea.replyCount || 0,
          time: createdAt ? new Date(createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '',
          liked: idea.userHasVoted || false
        };
      });
      
  // backend returns most-recent-first; display oldest-first so new ideas append to bottom
  setIdeas(transformedIdeas.reverse());
      setError(null);
    } catch (err) {
      console.error('Failed to fetch ideas:', err);
      setError('Failed to load ideas. Using demo data.');
      // Keep mock data if fetch fails
      setIdeas([
        { id: 1, author: 'JR', title: 'Migration of to new IDE', content: 'I have recently heard about a new IDE that i believe would assist with our projects what do you guys think of moving our projects to it?', tag: 'Software', likes: 20, replies: 3, time: '09:17 AM', liked: false },
        { id: 2, author: 'ME', title: 'New management', content: 'As we all know our previous group leader has quit so therefor I believe we should host a voting for a new leader on Friday.', tag: 'Organisation', likes: 14, replies: 6, time: '09:24 AM', liked: false }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id) => {
    // Keep a snapshot in case we need to roll back on failure
    const prev = ideas.slice();

    // Optimistic update (quick UI response)
    setIdeas(ideas.map(idea =>
      idea.id === id
        ? { ...idea, likes: idea.liked ? idea.likes - 1 : idea.likes + 1, liked: !idea.liked }
        : idea
    ));

    try {
      // Prefer jwt_profile for current user id (some parts of app store it there)
      const profile = JSON.parse(localStorage.getItem('jwt_profile') || 'null') || {};
      const userId = profile?.userId || profile?.id || Number(localStorage.getItem('userId')) || 1;

      const result = await toggleVote(id, userId);

      // Backend returns VoteActionResult with Counts (upVotes/downVotes) and Action
      // Use that authoritative count to update the UI so it's consistent after navigation
      if (result && result.counts) {
        setIdeas(curr => curr.map(idea =>
          idea.id === id ? { ...idea, likes: result.counts.upVotes ?? idea.likes, liked: result.action !== 'removed' } : idea
        ));
      }
    } catch (err) {
      console.error('Failed to toggle vote:', err);
      // revert optimistic UI
      setIdeas(prev);
    }
  };

  const handlePostIdea = async () => {
    if (!newIdeaTitle.trim() || !newIdeaContent.trim()) {
      alert('Please enter both title and content');
      return;
    }

    setIsPosting(true);
    
    try {
      if (!selectedGroup) {
        alert('Please select a group before posting an idea.');
        return;
      }
      const newIdea = await createIdea({
        title: newIdeaTitle,
        content: newIdeaContent,
        groupID: selectedGroup.groupId,
        // createIdea service will fill userID from localStorage if missing
      });

      // Add new idea to the list (mark as mine)
      let currentUserId = null;
      try {
        const profile = JSON.parse(localStorage.getItem('jwt_profile') || '{}');
        currentUserId = profile?.userId ?? profile?.id ?? null;
      } catch (e) {
        currentUserId = null;
      }

      const transformedIdea = {
        id: newIdea.id || newIdea.ideaId || newIdea.IdeaId || newIdea.IdeaID || Date.now(),
        author: 'YOU',
        authorId: currentUserId,
        isMine: true,
        title: newIdeaTitle,
        content: newIdeaContent,
        tag: newIdeaTag || 'General',
        likes: 0,
        replies: 0,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        liked: false
      };

      // append to the end so newest appears at bottom
      setIdeas([...ideas, transformedIdea]);
      setNewIdeaTitle('');
      setNewIdeaContent('');
      setNewIdeaTag('');
      
      alert('✅ Idea posted successfully!');
    } catch (err) {
      console.error('Failed to post idea:', err);
      alert('❌ Failed to post idea. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  const handlePostPersonalIdea = async () => {
    if (!newIdeaTitle.trim() || !newIdeaContent.trim()) {
      alert('Please enter both title and content');
      return;
    }

    setIsPosting(true);
    try {
      // create with no groupID => personal note
      const newIdea = await createIdea({
        title: newIdeaTitle,
        content: newIdeaContent,
        groupID: null
      });

      const transformedIdea = {
        id: newIdea.id || newIdea.ideaId || newIdea.IdeaId || newIdea.IdeaID || Date.now(),
        author: 'YOU',
        authorId: JSON.parse(localStorage.getItem('jwt_profile') || '{}')?.userId ?? null,
        isMine: true,
        title: newIdeaTitle,
        content: newIdeaContent,
        tag: newIdeaTag || 'General',
        likes: 0,
        replies: 0,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        liked: false
      };

      setPersonalIdeas([...personalIdeas, transformedIdea]);
      setNewIdeaTitle('');
      setNewIdeaContent('');
      setNewIdeaTag('');

      alert('✅ Personal idea saved!');
    } catch (err) {
      console.error('Failed to save personal idea:', err);
      alert('❌ Failed to save personal idea.');
    } finally {
      setIsPosting(false);
    }
  };

  // Share modal helpers
  const openShareModal = async (idea) => {
    setShareIdea(idea);
    setShareOpen(true);
    try {
      const list = await getMyGroups();
      setMyGroups(list);
    } catch (e) {
      console.error('Failed to load groups for sharing', e);
      setMyGroups([]);
    }
  };

  const confirmShare = () => {
    if (!selectedShareGroup || !shareIdea) return alert('Please select a group to share to.');
    // navigate to collab ideas with selectedGroup in state and prefill data
    navigate('/home-page/Collab/ideas', { state: { selectedGroup: selectedShareGroup, prefill: { title: shareIdea.title, content: shareIdea.content, tag: shareIdea.tag } } });
    setShareOpen(false);
    setShareIdea(null);
    setSelectedShareGroup(null);
  };

  // scroll to bottom when ideas change
  useEffect(() => {
    if (ideasContainerRef.current) {
      ideasContainerRef.current.scrollTop = ideasContainerRef.current.scrollHeight;
    }
  }, [ideas]);

  const teamMembers = [
    { id: 1, emoji: '👨‍💼' },
    { id: 2, emoji: '👨‍🦰' },
    { id: 3, emoji: '👩‍💼' },
    { id: 4, emoji: '👨‍💻' }
  ];

  return (
    <>
      {error && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded-lg text-yellow-800 text-sm">⚠️ {error}</div>
      )}
      <div className="mb-6" />

      {!selectedGroup ? (
        <div className="p-8 bg-white rounded shadow-md">
          <h3 className="text-xl font-medium mb-2">No group selected</h3>
          <p className="text-gray-600 mb-4">You are not currently in a group or haven't selected one. Collaboration features (ideas, chat, resources) are available when you enter a group.</p>
          <div className="flex gap-2">
              <button onClick={() => {
                if (outlet?.setCreateModalOpen) {
                  outlet.setCreateModalOpen(true);
                } else {
                  // navigate to Collab and ask it to open the create modal via state
                  navigate('/home-page/Collab', { state: { openCreateModal: true } });
                }
              }} className="px-4 py-2 bg-purple-500 text-white rounded cursor-pointer">Create a group</button>
            </div>
        </div>
      ) : loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading ideas...</p>
        </div>
      ) : (
        <div className="relative">
          {/* Make the list take available viewport height minus header/composer so it scrolls independently */}
          <div ref={ideasContainerRef} className="overflow-y-auto mb-6 space-y-6 pb-40" style={{ maxHeight: 'calc(100vh - 220px)' }}>
              {ideas.map((idea) => (
                <IdeaCard key={idea.id} idea={idea} onLike={handleLike} allowShare={props.allowShare} onShare={openShareModal} />
              ))}
          </div>

          {/* Composer fixed to the viewport bottom so it remains visible while scrolling */}
          <div className="fixed bottom-0 left-[339px] right-0 z-50">
            <div className="max-w-[1100px] mx-auto px-6">
              <div className="bg-white/95 backdrop-blur-md border-t border-gray-200 p-6 rounded-t-xl shadow-lg">
          <div className="flex gap-4 mb-4">
            <Input placeholder={(isPersonalView || selectedGroup) ? 'Title' : 'Select a group to post ideas'} value={newIdeaTitle} onChange={(e) => setNewIdeaTitle(e.target.value)} className="w-1/3" disabled={!(isPersonalView || selectedGroup)} />
                  <div className="w-[1px] h-12 bg-black/10"></div>
                  <input type="text" placeholder={selectedGroup ? 'Tag' : 'Group required'} value={newIdeaTag} onChange={(e) => setNewIdeaTag(e.target.value)} className="px-4 py-2 bg-[#F3EFFF] text-black rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-black font-light text-lg" disabled={!selectedGroup} />
                </div>

                <div className="flex gap-4 items-start">
                  <textarea
                    placeholder={selectedGroup ? 'Explain your idea...' : 'Select a group to enable posting'}
                    value={newIdeaContent}
                    onChange={(e) => setNewIdeaContent(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { handlePostIdea(); } }}
                    className="flex-1 px-4 py-3 min-h-[92px] rounded-lg border border-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-purple-400 font-light text-lg"
                    disabled={!selectedGroup}
                  />

                  <div className="flex flex-col items-center">
                    <button onClick={isPersonalView ? handlePostPersonalIdea : handlePostIdea} disabled={isPosting || !(isPersonalView || selectedGroup)} className="w-20 h-12 bg-purple-500 text-white rounded-lg flex items-center justify-center hover:bg-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed">
                      {isPosting ? (<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>) : (<Send className="w-5 h-5 text-white" />)}
                    </button>
                    <div className="text-xs text-gray-500 mt-2">Press Ctrl+Enter to submit</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Share modal */}
      {shareOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg w-[720px] p-6">
            <h3 className="text-xl font-semibold mb-4">Share idea to a group</h3>
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">Select a group</div>
              <div className="grid grid-cols-3 gap-4">
                {myGroups.length === 0 ? (
                  <div className="text-sm text-gray-500">You are not in any groups.</div>
                ) : myGroups.map(g => (
                  <button key={g.groupId} onClick={() => setSelectedShareGroup(g)} className={`p-4 rounded-lg border ${selectedShareGroup?.groupId === g.groupId ? 'border-purple-500 bg-purple-50' : 'border-gray-200 bg-white'} flex flex-col items-center gap-2` }>
                    <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">{(g.name && g.name[0]) ? g.name[0].toUpperCase() : 'G'}</span>
                    </div>
                    <div className="text-sm text-gray-800 mt-2 text-center">{g.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">Preview</div>
              <div className="p-4 border rounded">
                <div className="font-medium">{shareIdea?.title}</div>
                <div className="text-sm text-gray-700">{shareIdea?.content}</div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => { setShareOpen(false); setShareIdea(null); setSelectedShareGroup(null); }} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={confirmShare} className="px-4 py-2 bg-purple-500 text-white rounded">Share to group</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
