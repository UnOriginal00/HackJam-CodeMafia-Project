import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { getMyGroups } from '../../services/groupsService';

export default function GroupsList() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const list = await getMyGroups();
        if (!mounted) return;
        setGroups(list);
      } catch (err) {
        console.error('Failed to load groups', err);
        setGroups([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const outlet = useOutletContext ? useOutletContext() : null;
  const enterGroup = (group) => {
    // set selected group via outlet context when available so CollabLayout updates immediately
    if (outlet && outlet.setSelectedGroup) outlet.setSelectedGroup(group);
    // navigate to the ideas view for the selected group
    navigate('/home-page/Collab/ideas');
  };

  return (
    <div className="p-2 text-center">
      <h1 className="text-4xl font-bold mb-6">Groups</h1>
      {loading ? (
        <div>Loading groups…</div>
      ) : (
        <div className="max-w-5xl mx-auto">
          {groups.length === 0 ? (
            <div className="text-gray-600 p-8 bg-white rounded shadow">
              <div className="text-lg mb-3">You are not in any groups yet.</div>
              <div className="mb-4">Create a group to start collaborating with others.</div>
              <div>
                <button className="px-4 py-2 bg-purple-500 text-white rounded">Create group</button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {groups.map(g => (
                <button key={g.groupId} onClick={() => enterGroup(g)} className="flex flex-col items-center p-4 bg-transparent hover:scale-105 transform transition">
                  {/* Avatar: show initial letter in a colored circle instead of a plain black placeholder */}
                  <div
                    className="w-20 h-20 rounded-full bg-indigo-600 mb-2 shadow-inner flex items-center justify-center"
                    aria-hidden="false"
                    aria-label={g.name ? `Group ${g.name}` : 'Group'}
                  >
                    <span className="text-white font-semibold text-2xl">{(g.name && g.name[0]) ? g.name[0].toUpperCase() : 'G'}</span>
                  </div>
                  <div className="text-center text-sm font-medium text-gray-900">{g.name}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
