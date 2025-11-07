import React, { useContext } from 'react';
import { Lightbulb, Bell, User } from 'lucide-react';
import ProfileSideBar from './ProfileSideBar';
import { AuthContext } from '../../../auth/AuthContext';
import { getMyInvites, acceptInvite, declineInvite } from '../../services/inviteService';

// SharedHeader provides the same header used across Home / Collab / MyDesk.
// Props:
// - title (string) optional, defaults to 'Innovation Lounge'
// - rightContent (node) optional, renders to the right of the header icons (e.g., quick-view)
// - badgeCount (number) optional, shown on bell
export default function SharedHeader({ title = 'Innovation Lounge', rightContent = null, badgeCount = 3 }) {
  const [showProfile, setShowProfile] = React.useState(false);
  const profileRef = React.useRef(null);
  const [inviteCount, setInviteCount] = React.useState(null);
  const [invites, setInvites] = React.useState(null);
  const [showInvites, setShowInvites] = React.useState(false);
  const bellRef = React.useRef(null);

  // Prefer AuthContext user (reactive). Fallback to localStorage. Build a full name (name + surName).
  const auth = useContext(AuthContext);
  let displayName = '';
  let initials = '';
  try {
    const profile = auth?.user || JSON.parse(localStorage.getItem('jwt_profile') || 'null') || {};

    // helper: search for keys in object or one level nested
    const findField = (obj, candidates) => {
      if (!obj || typeof obj !== 'object') return null;
      for (const k of candidates) if (obj[k]) return obj[k];
      for (const v of Object.values(obj)) {
        if (v && typeof v === 'object') {
          for (const k of candidates) if (v[k]) return v[k];
        }
      }
      return null;
    };

    const first = (findField(profile, ['name', 'firstName', 'fullName']) || '').toString().trim();
    const last = (findField(profile, ['surName', 'lastName']) || '').toString().trim();
    const username = (findField(profile, ['userName', 'username']) || '').toString().trim();
    const email = (findField(profile, ['email']) || '').toString().trim();

    const combined = `${first} ${last}`.trim();
    if (combined) displayName = combined;
    else if (first) displayName = first;
    else if (username) displayName = username;
    else if (email) {
      const local = email.split('@')[0] || '';
      const words = local.replace(/[._\-]+/g, ' ').split(' ').filter(Boolean);
      displayName = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    } else displayName = '';

    // initials fallback for avatar: use first letters of first/last or of displayName parts
    const nameParts = (combined || displayName).split(' ').filter(Boolean);
    if (nameParts.length === 0) initials = '';
    else if (nameParts.length === 1) initials = nameParts[0].charAt(0).toUpperCase();
    else initials = (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  } catch (e) {
    displayName = '';
    initials = '';
  }

  const toggleProfile = () => setShowProfile((s) => !s);

  React.useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setShowInvites(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch pending invites and update badge. Poll periodically and react to invite:sent events.
  React.useEffect(() => {
    let mounted = true;
    let timer = null;

    const load = async () => {
      try {
        const list = await getMyInvites();
        if (!mounted) return;
        const arr = Array.isArray(list) ? list : [];
        setInvites(arr);
        setInviteCount(arr.length);
      } catch (e) {
        // ignore errors silently; keep existing badge
      }
    };

    load();
    // poll every 30s
    timer = setInterval(load, 30000);

    const onSent = () => { load(); };
    window.addEventListener('invite:sent', onSent);

    return () => {
      mounted = false;
      clearInterval(timer);
      window.removeEventListener('invite:sent', onSent);
    };
  }, []);

  const refreshInvites = async () => {
    try {
      const list = await getMyInvites();
      const arr = Array.isArray(list) ? list : [];
      setInvites(arr);
      setInviteCount(arr.length);
    } catch (e) {
      // ignore
    }
  };

  const handleAccept = async (inviteId) => {
    try {
      await acceptInvite(inviteId);
      await refreshInvites();
    } catch (e) {
      console.error('Accept invite failed', e);
    }
  };

  const handleDecline = async (inviteId) => {
    try {
      await declineInvite(inviteId);
      await refreshInvites();
    } catch (e) {
      console.error('Decline invite failed', e);
    }
  };

  // choose which count to display: when inviteCount is null (loading) fall back to badgeCount prop,
  // otherwise show the real inviteCount. Hide badge when count is 0.
  const countToShow = inviteCount === null ? badgeCount : inviteCount;

  return (
    <header className="border-b-[0.6px] border-black/75 px-5 py-4 w-full">
      <div className="flex items-center justify-between max-w-[1440px] mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-purple-400 rounded-lg flex items-center justify-center">
            <Lightbulb className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-semibold" style={{
            background: 'linear-gradient(90deg, rgba(246, 157, 75, 0.96) 0%, rgba(177, 155, 217, 0.96) 74.04%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
          }}>
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-6">
          {rightContent}
          <div className="relative" ref={bellRef}>
            <button onClick={() => setShowInvites(s => !s)} aria-label="Notifications" className="relative">
              <Bell className="w-6 h-6 text-gray-700" />
              {countToShow > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#F24822] text-white text-xs rounded-full flex items-center justify-center font-normal">{countToShow}</span>
              )}
            </button>

            {showInvites && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded shadow-lg z-50">
                <div className="px-4 py-3 border-b font-medium">Invites</div>
                <div className="max-h-64 overflow-y-auto">
                  {(!invites || invites.length === 0) ? (
                    <div className="p-3 text-sm text-gray-600">No pending invites.</div>
                  ) : invites.map(inv => (
                    <div key={inv.inviteId} className="p-3 border-b last:border-b-0">
                      <div className="flex items-start justify-between">
                        <div className="text-sm">
                          <div className="font-medium">From: User {inv.senderUserId}</div>
                          <div className="text-xs text-gray-600">Group: {inv.groupId}</div>
                          {inv.message ? <div className="mt-1 text-sm">"{inv.message}"</div> : null}
                          <div className="text-xs text-gray-400 mt-1">{new Date(inv.createdAt).toLocaleString()}</div>
                        </div>
                        <div className="ml-3 flex flex-col gap-2">
                          <button onClick={() => handleAccept(inv.inviteId)} className="px-3 py-1 bg-green-600 text-white rounded text-sm">Accept</button>
                          <button onClick={() => handleDecline(inv.inviteId)} className="px-3 py-1 bg-gray-200 text-black rounded text-sm">Decline</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-2 text-center text-xs text-gray-500"><button onClick={refreshInvites} className="underline">Refresh</button></div>
              </div>
            )}
          </div>

          <div className="relative flex items-center gap-3" ref={profileRef}>
            <button onClick={toggleProfile} className="w-16 h-16 bg-blue-500 rounded-[21px] flex items-center justify-center overflow-hidden">
              {initials ? (
                <div className="text-white font-semibold">{initials}</div>
              ) : (
                <User className="w-8 h-8 text-white" />
              )}
            </button>

            {/* username to the right of avatar, vertically centered and in black */}
            {displayName ? (
              <div className="text-black text-base font-medium max-w-[220px] truncate" title={displayName}>
                {displayName}
              </div>
            ) : null}

            {showProfile && (
              <div className="absolute top-full right-0 mt-2 z-50">
                <ProfileSideBar />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
