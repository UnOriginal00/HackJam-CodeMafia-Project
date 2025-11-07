import React from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Lightbulb, FileText, MessageSquare, Settings, Plus, UserPlus } from 'lucide-react';
import GroupsQuickView from './GroupsQuickView';
import CreateGroupModal from './CreateGroupModal';
import GroupSettingsModal from './GroupSettingsModal';
import InviteModal from './InviteModal';
import SharedHeader from './SharedHeader';

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
  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [inviteOpen, setInviteOpen] = React.useState(false);

  // Accept selectedGroup passed via navigation state (e.g., when sharing from MyDesk)
  React.useEffect(() => {
    if (location && location.state && location.state.selectedGroup) {
      setSelectedGroup(location.state.selectedGroup);
      // support opening the create modal via navigation state (fallback when outlet context not available)
      if (location.state.openCreateModal) {
        setCreateModalOpen(true);
      }
      // clear the navigation state so repeated visits don't reapply
      // Note: navigate with replace clears the state for this entry
      try {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        // useNavigate is available above; call replace to clear state
        // but to avoid re-declaring navigate, we use history.replaceState
        window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
      } catch (e) {
        // ignore
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-[#FEFEFE]" style={{ fontFamily: 'Krub, sans-serif' }}>
      <SharedHeader title="Innovation Lounge" />

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
                  <SidebarMenuItem icon={FileText} title="Resources" description="Check out the resources" onClick={() => navigate('/home-page/Collab/resources')} active={location.pathname === '/home-page/Collab/resources'} />
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

            <div className="mt-auto pt-96">
              {selectedGroup ? (
                <button onClick={() => setSettingsOpen(true)} className="flex items-center gap-2 px-3 py-2 bg-white/90 rounded">
                  <Settings className="w-6 h-6 text-black" />
                  <span className="text-sm">Settings</span>
                </button>
              ) : (
                <div className="text-sm text-white/60">Group settings available when a group is selected</div>
              )}
            </div>
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
                    <div className="text-4xl font-light text-white px-4 py-1 rounded-md max-w-[520px] truncate" title={selectedGroup.name} style={{ background: 'linear-gradient(90deg, rgba(246, 157, 75, 1) 0%, rgba(177, 155, 217, 1) 74.04%)' }}>
                      {selectedGroup.name}
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center gap-3">
                <GroupsQuickView onSelect={(g) => { setSelectedGroup(g); navigate('/home-page/Collab/ideas'); }} selectedGroupId={selectedGroup?.groupId} />
                <button onClick={() => setInviteOpen(true)} title="Invite user to group" className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow hover:opacity-90 transition bg-gradient-to-br from-green-400 to-emerald-500"><UserPlus className="w-5 h-5" /></button>
                <button onClick={() => setCreateModalOpen(true)} className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow hover:opacity-90 transition" style={{ background: 'linear-gradient(317.49deg, rgba(246, 157, 75, 0.9) 23.12%, rgba(206, 168, 163, 0.9) 30.11%, rgba(166, 179, 250, 0.9) 40.46%, rgba(189, 181, 253, 0.9) 55.21%)' }}><Plus className="w-6 h-6 stroke-[4px]" /></button>
                <CreateGroupModal open={createModalOpen} onClose={() => setCreateModalOpen(false)} onCreated={(g) => {
                  const norm = {
                    groupId: g.groupId ?? g.groupId ?? g.GroupId,
                    name: g.groupName ?? g.groupName ?? g.GroupName ?? g.group_name ?? g.GroupName,
                    description: g.description ?? g.Description ?? ''
                  };
                  setSelectedGroup(norm);
                  setCreateModalOpen(false);
                  navigate('/home-page/Collab/ideas');
                }} />
                <GroupSettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} groupId={selectedGroup?.groupId} onDeleted={() => {
                  setSelectedGroup(null);
                  setSettingsOpen(false);
                  navigate('/home-page/Collab');
                }} onRenamed={(newName) => {
                  setSelectedGroup(prev => prev ? { ...prev, name: newName } : prev);
                }} />
              </div>

              <InviteModal open={inviteOpen} onClose={() => setInviteOpen(false)} groupId={selectedGroup?.groupId} onSent={(invite) => {
                setInviteOpen(false);
                try { window?.dispatchEvent(new CustomEvent('invite:sent', { detail: invite })); } catch (e) {}
              }} />
            </div>
          </div>

          {/* Main area: render children / nested routes. The GroupsList (index) will render the group grid. */}
          <div className="flex">
            <div className="w-full">
              {children ? (React.isValidElement(children) ? React.cloneElement(children, { selectedGroup, setSelectedGroup }) : children)
                : <Outlet context={{ selectedGroup, setSelectedGroup, setCreateModalOpen, setInviteOpen }} />}
            </div>

            {/* Render features panel only when a group is selected */}
            {/* Right-side info panel removed as requested */}
          </div>
        </main>
      </div>
    </div>
  );
}
