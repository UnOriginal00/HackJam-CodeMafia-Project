import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../auth/AuthContext';
import { Users, FileText, PlusSquare, Heart, ArrowUpRight } from 'lucide-react';
import SharedHeader from './SharedHeader';
import { useNavigate } from 'react-router-dom';
import { getMyDashboard } from '../../services/dashboardService';

export default function Dashboard() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const profile = auth?.user || JSON.parse(localStorage.getItem('jwt_profile') || 'null') || {};

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
  const email = (findField(profile, ['email']) || '').toString().trim();
  const userId = profile.userId ?? profile.id ?? profile.UserId ?? profile.UserID ?? null;

  const displayName = `${first} ${last}`.trim() || (first || '').toString() || (findField(profile, ['userName', 'username']) || '').toString() || (email ? email.split('@')[0] : '');

  // stats are provided by backend DashboardDto
  const stats = [
    { id: 'groups_member_of', title: 'Groups you are in', value: dashboard?.totalGroupsMemberOf ?? '—', icon: Users },
    { id: 'ideas_total', title: 'Ideas posted', value: dashboard?.totalIdeasPosted ?? '—', icon: FileText },
    { id: 'groups_created', title: 'Groups created', value: dashboard?.groupsCreated ?? '—', icon: PlusSquare },
    { id: 'upvotes', title: 'Upvotes received', value: dashboard?.totalUpvotes ?? '—', icon: Heart },
  ];

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const data = await getMyDashboard();
        if (!mounted) return;
        setDashboard(data);
      } catch (e) {
        console.error('Failed to load dashboard', e);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div>
      <SharedHeader title="Dashboard" />
      <div className="max-w-[1200px] mx-auto p-6">
      <div className="mb-6 flex items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-orange-400 to-purple-500 flex items-center justify-center text-white font-bold text-2xl">
          {/* initials avatar */}
          {(() => {
            const nameParts = (displayName || '').split(' ').filter(Boolean);
            if (nameParts.length === 0) return <span className="text-2xl">?</span>;
            if (nameParts.length === 1) return <span className="text-2xl">{nameParts[0].charAt(0).toUpperCase()}</span>;
            return <span className="text-2xl">{(nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase()}</span>;
          })()}
        </div>
        <div>
          <h2 className="text-3xl font-bold">{displayName || 'Your name'}</h2>
          <p className="text-sm text-gray-600">{email || 'email@example.com'} • ID: {userId ?? 'N/A'}</p>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center w-full">Loading dashboard…</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.id} className="bg-white rounded-lg shadow-md p-6 flex flex-col items-start justify-between h-40">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-orange-300 to-purple-300 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">{s.title}</div>
                  <div className="text-2xl font-semibold mt-2">{s.value}</div>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      )}

      <div className="mt-8 flex gap-4">
        <button onClick={() => navigate('/home-page/Collab')} className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-orange-400 to-purple-500 text-white rounded-lg shadow hover:opacity-95 cursor-pointer">
          <ArrowUpRight className="w-4 h-4" />
          <span className="font-medium">Go to Collab Zone</span>
        </button>

        <button onClick={() => navigate('/home-page/MyDeskPage')} className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-50 cursor-pointer">
          <Users className="w-4 h-4 text-gray-700" />
          <span className="font-medium text-gray-700">Open MyDesk</span>
        </button>
      </div>
    </div>
    </div>
  );
}
