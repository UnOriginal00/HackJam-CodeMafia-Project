import React, { useState, useEffect } from "react";
import {
  FileText,
  Lightbulb,
  MessageSquare,
  Settings,
  Send,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import SharedHeader from './SharedHeader';
import MyDeskIdeas from './MyDeskIdeas';

// Avatar Component
const Avatar = ({ initials, size = "md" }) => {
  const sizes = {
    sm: "w-10 h-10 text-sm",
    md: "w-12 h-12 text-base",
    lg: "w-14 h-14 text-xl",
  };

  return (
    <div
      className={`${sizes[size]} rounded-full bg-gray-200 border border-gray-400 flex items-center justify-center font-normal text-gray-700`}
    >
      {initials}
    </div>
  );
};

// Sidebar Menu Item Component
const SidebarMenuItem = ({
  icon: Icon,
  title,
  description,
  active = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer bg-white/70 rounded-lg p-4 flex items-start gap-3 ${
        active ? "border-3 border-purple-600" : ""
      }`}
    >
      <Icon className="w-8 h-8 flex-shrink-0 text-black" />
      <div>
        <div className="font-normal text-lg text-black">{title}</div>
        <div className="text-sm text-gray-800">{description}</div>
      </div>
    </div>
  );
};

// Simple Bot Icon (inline SVG)
const BotIcon = ({ className = "w-8 h-8 flex-shrink-0 text-black" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <rect x="3" y="7" width="18" height="10" rx="2" ry="2" fill="currentColor" />
    <circle cx="8" cy="12" r="1.2" fill="#fff" />
    <circle cx="16" cy="12" r="1.2" fill="#fff" />
    <rect x="9" y="15" width="6" height="1" rx="0.5" ry="0.5" fill="#fff" />
    <rect x="11" y="4" width="2" height="3" rx="0.5" ry="0.5" fill="currentColor" />
  </svg>
);

// Input Component
const Input = ({
  placeholder,
  value,
  onChange,
  onKeyPress,
  className = "",
}) => {
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

// Button Component
const Button = ({ children, variant = "primary", onClick, className = "" }) => {
  const variants = {
    primary: "bg-purple-400 hover:bg-purple-500 text-white",
    secondary: "bg-orange-400 hover:bg-orange-500 text-white",
    gradient:
      "bg-gradient-to-r from-orange-400 to-purple-400 hover:opacity-90 text-white",
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

export default function MyDeskPage() {
  const navigate = useNavigate();

  // which view is shown in the main area: 'ideas' | 'ai' | 'chat'
  const [activeView, setActiveView] = useState('ideas');

  // Navigation
  const goHome = () => navigate("/home-page");
  const goCollab = () => navigate("/home-page/Collab");

  // Chat - start empty; we'll inject an initial AI greeting when entering the chat view
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const msg = {
      id: messages.length + 1,
      author: "YOU",
      content: newMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages([...messages, msg]);
    setNewMessage("");
  };

  // When user opens the chat view, inject an initial AI greeting if none exists
  useEffect(() => {
    if (activeView !== 'chat') return;
    setMessages((prev) => {
      // if there's already an AI message, do nothing
      if (prev.some(m => m.isAi)) return prev;
      const aiMsg = {
        id: Date.now(),
        author: 'AI',
        content: 'Hello — I\'m your AI companion. I can summarise notes, suggest ideas, and help refine prompts. How can I help today?',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAi: true
      };
      return [...prev, aiMsg];
    });
  }, [activeView]);

  // Profile dropdown is handled globally by SharedHeader

  return (
    <div className="min-h-screen bg-[#FEFEFE]" style={{ fontFamily: "Krub, sans-serif" }}>
      {/* Shared header (contains avatar dropdown) */}
      <SharedHeader />

      {/* Body Layout */}
      <div className="flex max-w-[1440px] mx-auto">
        {/* Sidebar */}
        <aside className="w-[339px] p-5">
          <div
            className="rounded-[4.5px] p-6 min-h-[782px]"
            style={{
              background:
                "linear-gradient(317.49deg, rgba(246, 157, 75, 0.9) 23.12%, rgba(206, 168, 163, 0.9) 30.11%, rgba(166, 179, 250, 0.9) 40.46%, rgba(189, 181, 253, 0.9) 55.21%)",
            }}
          >
            <div className="mb-8">
              <h2 className="text-4xl font-semibold text-[#F7F6FD] mb-2">Features</h2>
              <div className="w-full h-[1px] bg-white"></div>
            </div>

            {/* Menu Items */}
            <div className="space-y-4">
              <SidebarMenuItem icon={FileText} title="Resources" description="Check out the resources" onClick={() => setActiveView('resources')} active={activeView === 'resources'} />
              <SidebarMenuItem
                icon={Lightbulb}
                title="Ideas"
                description="Note down new ideas"
                onClick={() => setActiveView('ideas')}
                active={activeView === 'ideas'}
              />
              {/* AI companion moved into the Chat view; sidebar button removed to keep the chat input available */}
              <SidebarMenuItem
                icon={BotIcon}
                title="AI Companion"
                description="Personal AI assistant"
                onClick={() => setActiveView('chat')}
                active={activeView === 'chat'}
              />
            </div>

            {/* Settings Icon */}
            <div className="mt-auto pt-96">
              <Settings className="w-6 h-6 text-black" />
            </div>
          </div>

          {/* Bottom Buttons */}
          <div className="mt-4 flex gap-3">
            <Button variant="primary" className="flex-1 rounded-[4px]" onClick={goHome}>
              Home
            </Button>
            <Button variant="secondary" className="flex-1 rounded-[4px]" onClick={goCollab}>
              CollabZone
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 border-l-[0.6px] border-black/75 flex flex-col justify-between">
          {/* Switch views based on activeView */}
          <div className="flex-1 overflow-y-auto mb-6">
            {activeView === 'ideas' && (
              <div>
                {/* MyDesk-specific ideas view (personal ideas) */}
                <MyDeskIdeas />
              </div>
            )}

            {/* AI companion header injected into chat view so chat input remains available */}

            {activeView === 'chat' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="text-2xl font-semibold">AI Companion</div>
                    <div className="text-sm text-gray-600">Personal AI assistant</div>
                  </div>
                </div>
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className="flex items-start gap-3">
                      <Avatar initials={msg.author} size="sm" />
                      <div>
                        <div className="text-sm text-gray-600">
                          {msg.author} • {msg.time}
                        </div>
                        <div className="bg-gray-200/50 rounded-lg px-4 py-2 mt-1 text-gray-800">
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeView === 'resources' && (
              <div>
                <h3 className="text-2xl font-semibold mb-2">Resources</h3>
                <div className="p-4 rounded-lg bg-white/80 text-gray-800">Resources and links go here.</div>
              </div>
            )}
          </div>

          {/* Bottom composer / input area shown only for chat view */}
          {activeView === 'chat' && (
            <div className="flex gap-4">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <button
                onClick={handleSendMessage}
                className="w-[84px] h-16 bg-[#EEEBEF] rounded-lg flex items-center justify-center hover:bg-gray-300 transition"
              >
                <Send className="w-8 h-8 text-gray-700" />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
