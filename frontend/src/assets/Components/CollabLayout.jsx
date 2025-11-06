import React from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Lightbulb, Bell, User, FileText, MessageSquare, Settings, Plus } from 'lucide-react';
import GroupsQuickView from './GroupsQuickView';

const Button = ({ children, variant = 'primary', onClick, className = '' }) => {
  const variants = {
    primary: 'bg-purple-400 hover:bg-purple-500 text-white',
    secondary: 'bg-orange-400 hover:bg-orange-500 text-white',
  };
  return (
    <button onClick={onClick} className={`px-6 py-3 rounded font-medium transition ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const TeamAvatar = ({ emoji, size = 'md' }) => {
  const sizes = { sm: 'w-10 h-10 text-xl', md: 'w-14 h-14 text-2xl', lg: 'w-16 h-16 text-3xl' };
  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-white shadow flex items-center justify-center`}>
      {emoji}
    </div>
  );
};

const SidebarMenuItem = ({ icon: Icon, title, description, active = false, onClick }) => (
  <button onClick={onClick} className={`w-full bg-white/70 rounded-lg p-4 flex items-start gap-3 hover:bg-white/90 transition ${active ? 'border-3 border-purple-600' : ''}`}>
    <Icon className="w-8 h-8 flex-shrink-0 text-black" />
    <div className="text-left">
      <div className="font-normal text-lg text-black">{title}</div>
      <div className="text-sm text-gray-800">{description}</div>
    </div>
  </button>
);

export default function CollabLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedGroup, setSelectedGroup] = React.useState(null);

  return (
    <div className="min-h-screen bg-[#FEFEFE]" style={{ fontFamily: 'Krub, sans-serif' }}>
      <header className="border-b-[0.6px] border-black/75 px-5 py-4">
        <div className="flex items-center justify-between max-w-[1440px] mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-purple-400 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-semibold" style={{
              background: 'linear-gradient(90deg, rgba(246, 157, 75, 0.96) 0%, rgba(177, 155, 217, 0.96) 74.04%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
            }}>
              Innovation Lounge
            </h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <Bell className="w-6 h-6 text-gray-700" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#F24822] text-white text-xs rounded-full flex items-center justify-center font-normal">3</span>
            </div>
            <div className="w-16 h-16 bg-blue-500 rounded-[21px] flex items-center justify-center overflow-hidden">
              <User className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex max-w-[1440px] mx-auto">
        <aside className="w-[339px] p-5">
          <div className="rounded-[4.5px] p-6 min-h-[782px]" style={{ background: 'linear-gradient(317.49deg, rgba(246, 157, 75, 0.9) 23.12%, rgba(206, 168, 163, 0.9) 30.11%, rgba(166, 179, 250, 0.9) 40.46%, rgba(189, 181, 253, 0.9) 55.21%)' }}>
            <div className="mb-8">
              <h2 className="text-4xl font-semibold text-[#F7F6FD] mb-2">Features</h2>
              <div className="w-full h-[1px] bg-white"></div>
            </div>

            <div className="space-y-4">
              {selectedGroup ? (
                <>
                  <SidebarMenuItem icon={FileText} title="Resources" description="Check out the resources" onClick={() => navigate('/resources')} active={location.pathname === '/resources'} />
                  <SidebarMenuItem icon={Lightbulb} title="Ideas" description="Note down new ideas" onClick={() => navigate('/home-page/Collab/ideas')} active={location.pathname === '/home-page/Collab/ideas'} />
                  <SidebarMenuItem icon={MessageSquare} title="General Chat" description="Chat with your group" onClick={() => navigate('/home-page/Collab/chat')} active={location.pathname === '/home-page/Collab/chat'} />
                </>
              ) : (
                <div className="p-4 bg-white/70 rounded-lg text-sm text-gray-800">
                  Select a group to see collaboration features here.
                </div>
              )}

              {/* Group view button at bottom of feature list so users can return to group listing */}
              <div className="mt-4">
                <button onClick={() => { setSelectedGroup(null); navigate('/home-page/Collab'); }} className="w-full px-4 py-3 bg-white/90 rounded-lg border hover:bg-white transition text-sm font-medium">Group view</button>
              </div>
            </div>

            <div className="mt-auto pt-96"><Settings className="w-6 h-6 text-black" /></div>
          </div>

          <div className="mt-4 flex gap-3">
            <Button variant="primary" className="flex-1 rounded-[4px]" onClick={() => navigate('/home-page')}>Home</Button>
            <Button variant="secondary" className="flex-1 rounded-[4px]" onClick={() => navigate('/home-page/MyDeskPage')}>MyDesk</Button>
          </div>
        </aside>

        <main className="flex-1 p-6 border-l-[0.6px] border-black/75">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-4xl font-light" style={{ background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), linear-gradient(90deg, rgba(246, 157, 75, 0.96) 0%, rgba(177, 155, 217, 0.96) 74.04%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Collaboration Zone</h2>
                {selectedGroup && (
                  <>
                    <span className="text-gray-500 text-2xl">·</span>
                    <div className="text-4xl font-light text-white px-4 py-1 rounded-md" style={{ background: 'linear-gradient(90deg, rgba(246, 157, 75, 1) 0%, rgba(177, 155, 217, 1) 74.04%)' }}>
                      {selectedGroup.name}
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center gap-3">
                <GroupsQuickView onSelect={(g) => { setSelectedGroup(g); navigate('/home-page/Collab/ideas'); }} selectedGroupId={selectedGroup?.groupId} />
                <button className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow hover:opacity-90 transition" style={{ background: 'linear-gradient(317.49deg, rgba(246, 157, 75, 0.9) 23.12%, rgba(206, 168, 163, 0.9) 30.11%, rgba(166, 179, 250, 0.9) 40.46%, rgba(189, 181, 253, 0.9) 55.21%)' }}><Plus className="w-6 h-6 stroke-[4px]" /></button>
              </div>
            </div>
          </div>

          {/* Main area: render children / nested routes. The GroupsList (index) will render the group grid. */}
          <div className="flex">
            <div className="w-full">
              {children ? (React.isValidElement(children) ? React.cloneElement(children, { selectedGroup, setSelectedGroup }) : children)
                : <Outlet context={{ selectedGroup, setSelectedGroup }} />}
            </div>

            {/* Render features panel only when a group is selected */}
            {/* Right-side info panel removed as requested */}
          </div>
        </main>
      </div>
    </div>
  );
}
