import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  User,
  FileText,
  Lightbulb,
  MessageSquare,
  Settings,
  Send,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProfileSideBar from "./ProfileSideBar";

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

export default function CollaborationIdeas() {
  const navigate = useNavigate();

  // Navigation
  const goHome = () => navigate("/home-page");
  const goCollab = () => navigate("/home-page/Collab");

  // Chat
  const [messages, setMessages] = useState([
    { id: 1, author: "JR", content: "Hey team, ready for the meeting?", time: "09:00 AM" },
    { id: 2, author: "ME", content: "Yes, let’s start!", time: "09:02 AM" },
  ]);
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

  // Profile sidebar toggle
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);
  const toggleProfileSidebar = () => setShowProfile(!showProfile);

  // Close profile sidebar on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-[#FEFEFE]" style={{ fontFamily: "Krub, sans-serif" }}>
      {/* Header */}
      <header className="border-b-[0.6px] border-black/75 px-5 py-4">
        <div className="flex items-center justify-between max-w-[1440px] mx-auto">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-purple-400 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
            <h1
              className="text-4xl font-semibold"
              style={{
                background:
                  "linear-gradient(90deg, rgba(246, 157, 75, 0.96) 0%, rgba(177, 155, 217, 0.96) 74.04%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Innovation Lounge
            </h1>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-6 relative">
            <div className="relative">
              <Bell className="w-6 h-6 text-gray-700" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#F24822] text-white text-xs rounded-full flex items-center justify-center font-normal">
                3
              </span>
            </div>

            <div className="relative" ref={profileRef}>
              <button
                onClick={toggleProfileSidebar}
                className="w-16 h-16 bg-blue-500 rounded-[21px] flex items-center justify-center overflow-hidden"
              >
                <User className="w-8 h-8 text-white" />
              </button>

              {showProfile && (
                <div className="absolute top-full right-0 mt-2 z-50">
                  <ProfileSideBar />
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

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
              <SidebarMenuItem icon={FileText} title="Resources" description="Check out the resources" />
              <SidebarMenuItem
                icon={Lightbulb}
                title="Ideas"
                description="Note down new ideas"
                active={true}
              />
              <SidebarMenuItem
                icon={MessageSquare}
                title="Collab Zone"
                description="Go to collab page"
                onClick={goCollab}
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
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto mb-6 space-y-4">
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

          {/* Chat Input */}
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
        </main>
      </div>
    </div>
  );
}
