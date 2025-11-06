import React, { useEffect, useState } from 'react';
import { getMyGroups } from '../../services/groupsService';

export default function GroupsQuickView({ onSelect, selectedGroupId }) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const list = await getMyGroups();
        if (!mounted) return;
        setGroups(list.slice(0, 5));
      } catch (err) {
        console.error('Failed to load groups:', err);
        setGroups([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="text-sm text-gray-600">Loading groups…</div>;

  if (!groups || groups.length === 0) return (
    <div className="flex items-center gap-2">
      <div className="text-sm text-gray-600">You are not in any groups yet.</div>
    </div>
  );

  return (
    <div className="flex items-center gap-3">
      {groups.map(g => (
        <button
          key={g.groupId}
          onClick={() => onSelect && onSelect(g)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${selectedGroupId === g.groupId ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
          title={g.description || g.name}
        >
          {g.name}
        </button>
      ))}
    </div>
  );
}
