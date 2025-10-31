import React, { useState } from 'react';
import { Search, Bell, User, FileText, Lightbulb, MessageSquare, Settings, ThumbsUp, Plus, Send } from 'lucide-react';

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

// Team Avatar Component (with images/emojis)
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
const TagBadge = ({ tag }) => {
  return (
    <span className="px-4 py-1 bg-gradient-to-r from-orange-400 via-pink-200 to-purple-400 rounded-full text-xs font-normal text-black">
      {tag}
    </span>
  );
};

// Input Component
const Input = ({ placeholder, value, onChange, onKeyPress, className = '' }) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
      className={`px-4 py-3 bg-gray-200/50 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-purple-400 font-light text-lg ${className}`}
    />
  );
};

// Idea Card Component
const IdeaCard = ({ idea, onLike }) => {
  return (
    <div className="bg-white rounded-[51px] shadow-lg p-8">
      <div className="flex items-start gap-4">
        <Avatar initials={idea.author} size="md" />
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-normal">{idea.title}</h3>
            <TagBadge tag={idea.tag} />
          </div>
          
          <div className="w-full h-[1px] bg-black mb-3"></div>
          
          <p className="text-gray-800 mb-4 leading-relaxed font-normal">{idea.content}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6 text-gray-600">
              <button 
                onClick={() => onLike(idea.id)}
                className={`flex items-center gap-2 hover:text-gray-900 transition ${idea.liked ? 'text-purple-600' : ''}`}
              >
                <ThumbsUp className={`w-5 h-5 ${idea.liked ? 'fill-purple-600' : ''}`} />
                <span className="text-sm">{idea.likes}</span>
              </button>
              
              <button className="flex items-center gap-2 hover:text-gray-900 transition">
                <MessageSquare className="w-5 h-5" />
                <span className="text-sm">{idea.replies} replies</span>
              </button>
            </div>
            
            <div className="text-sm text-gray-600">{idea.time}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sidebar Menu Item Component
const SidebarMenuItem = ({ icon: Icon, title, description, active = false }) => {
  return (
    <div className={`bg-white/70 rounded-lg p-4 flex items-start gap-3 ${active ? 'border-3 border-purple-600' : ''}`}>
      <Icon className="w-8 h-8 flex-shrink-0 text-black" />
      <div>
        <div className="font-normal text-lg text-black">{title}</div>
        <div className="text-sm text-gray-800">{description}</div>
      </div>
    </div>
  );
};

// Main Component
export default function CollaborationIdeas() {
  const [ideas, setIdeas] = useState([
    {
      id: 1,
      author: 'JR',
      title: 'Migration of to new IDE',
      content: 'I have recently heard about a new IDE that i believe would assist with our projects what do you guys think of moving our projects to it?',
      tag: 'Software',
      likes: 20,
      replies: 3,
      time: '09:17 AM',
      liked: false
    },
    {
      id: 2,
      author: 'ME',
      title: 'New management',
      content: 'As we all know our previous group leader has quit so therefor I believe we should host a voting for a new leader on Friday.',
      tag: 'Organisation',
      likes: 14,
      replies: 6,
      time: '09:24 AM',
      liked: false
    },
    {
      id: 3,
      author: 'JR',
      title: 'Migration of to new IDE',
      content: 'I have recently heard about a new IDE that i believe would assist with our projects what do you guys think of moving our projects to it?',
      tag: 'Software',
      likes: 20,
      replies: 3,
      time: '09:17 AM',
      liked: false
    }
  ]);

  const [newIdeaTitle, setNewIdeaTitle] = useState('');
  const [newIdeaContent, setNewIdeaContent] = useState('');
  const [newIdeaTag, setNewIdeaTag] = useState('');

  const handleLike = (id) => {
    setIdeas(ideas.map(idea => 
      idea.id === id 
        ? { ...idea, likes: idea.liked ? idea.likes - 1 : idea.likes + 1, liked: !idea.liked }
        : idea
    ));
  };

  const handlePostIdea = () => {
    if (newIdeaTitle.trim() && newIdeaContent.trim()) {
      const newIdea = {
        id: ideas.length + 1,
        author: 'YOU',
        title: newIdeaTitle,
        content: newIdeaContent,
        tag: newIdeaTag || 'General',
        likes: 0,
        replies: 0,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        liked: false
      };
      setIdeas([newIdea, ...ideas]);
      setNewIdeaTitle('');
      setNewIdeaContent('');
      setNewIdeaTag('');
    }
  };

  const teamMembers = [
    { id: 1, emoji: '👨‍💼' },
    { id: 2, emoji: '👨‍🦰' },
    { id: 3, emoji: '👩‍💼' },
    { id: 4, emoji: '👨‍💻' }
  ];

  return (
    <div className="min-h-screen bg-[#FEFEFE]" style={{ fontFamily: 'Krub, sans-serif' }}>
      {/* Header */}
      <header className="border-b-[0.6px] border-black/75 px-5 py-4">
        <div className="flex items-center justify-between max-w-[1440px] mx-auto">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-purple-400 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-semibold" style={{
              background: 'linear-gradient(90deg, rgba(246, 157, 75, 0.96) 0%, rgba(177, 155, 217, 0.96) 74.04%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Innovation Lounge
            </h1>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <Bell className="w-6 h-6 text-gray-700" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#F24822] text-white text-xs rounded-full flex items-center justify-center font-normal">
                3
              </span>
            </div>
            <div className="w-16 h-16 bg-blue-500 rounded-[21px] flex items-center justify-center overflow-hidden">
              <User className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex max-w-[1440px] mx-auto">
        {/* Sidebar */}
        <aside className="w-[339px] p-5">
          <div className="rounded-[4.5px] p-6 min-h-[782px]" style={{
            background: 'linear-gradient(317.49deg, rgba(246, 157, 75, 0.9) 23.12%, rgba(206, 168, 163, 0.9) 30.11%, rgba(166, 179, 250, 0.9) 40.46%, rgba(189, 181, 253, 0.9) 55.21%)'
          }}>
            <div className="mb-8">
              <h2 className="text-4xl font-semibold text-[#F7F6FD] mb-2">Features</h2>
              <div className="w-full h-[1px] bg-white"></div>
            </div>

            {/* Menu Items */}
            <div className="space-y-4">
              <SidebarMenuItem 
                icon={FileText}
                title="Resources"
                description="Check out the resources"
              />
              
              <SidebarMenuItem 
                icon={Lightbulb}
                title="Ideas"
                description="Note down new ideas"
                active={true}
              />
              
              <SidebarMenuItem 
                icon={MessageSquare}
                title="General Chat"
                description="Chat with your group"
              />
            </div>

            {/* Settings Icon at Bottom */}
            <div className="mt-auto pt-96">
              <Settings className="w-6 h-6 text-black" />
            </div>
          </div>

          {/* Bottom Navigation Buttons */}
          <div className="mt-4 flex gap-3">
            <Button variant="primary" className="flex-1 rounded-[4px]">
              Home
            </Button>
            <Button variant="secondary" className="flex-1 rounded-[4px]">
              CollabZone
            </Button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 border-l-[0.6px] border-black/75">
          {/* Group Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <h2 className="text-4xl font-light" style={{
                background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), linear-gradient(90deg, rgba(246, 157, 75, 0.96) 0%, rgba(177, 155, 217, 0.96) 74.04%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Side Projects Group
              </h2>
              <div className="flex items-center gap-3">
                {teamMembers.map(member => (
                  <TeamAvatar key={member.id} emoji={member.emoji} />
                ))}
                <button className="w-14 h-14 rounded-full bg-gradient-to-br from-[#F69D4B]/90 via-[#CEA8A3]/90 via-[#A6B3FA]/90 to-[#BDB5FD]/90 flex items-center justify-center text-white shadow hover:opacity-90 transition">
                  <Plus className="w-6 h-6 stroke-[4px]" />
                </button>
              </div>
            </div>
          </div>

          {/* Ideas Feed */}
          <div className="space-y-6 mb-6">
            {ideas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} onLike={handleLike} />
            ))}
          </div>

          {/* New Idea Input Section */}
          <div className="bg-gray-200/50 rounded-lg p-6">
            <div className="flex gap-4 mb-4">
              <Input
                placeholder="Idea"
                value={newIdeaTitle}
                onChange={(e) => setNewIdeaTitle(e.target.value)}
                className="w-64"
              />
              <div className="w-[1px] h-12 bg-black/90"></div>
              <input
                type="text"
                placeholder="Tag"
                value={newIdeaTag}
                onChange={(e) => setNewIdeaTag(e.target.value)}
                className="px-4 py-2 bg-[#B19BD9] text-black rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-black font-light text-lg"
              />
            </div>
            <div className="flex gap-4">
              <Input
                placeholder="Explain your Idea ...."
                value={newIdeaContent}
                onChange={(e) => setNewIdeaContent(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handlePostIdea()}
                className="flex-1"
              />
              <button
                onClick={handlePostIdea}
                className="w-[84px] h-16 bg-[#EEEBEF] rounded-lg flex items-center justify-center hover:bg-gray-300 transition"
              >
                <Send className="w-8 h-8 text-gray-700" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}