import React, { useEffect, useState } from 'react';
import { getGroupDetails, renameGroup, deleteGroup, getGroupMembers } from '../../services/groupsService';

export default function GroupSettingsModal({ open, onClose, groupId, onDeleted, onRenamed }) {
  const [loading, setLoading] = useState(false);
  const [group, setGroup] = useState(null);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const NAME_MAX = 40;

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!open || !groupId) return;
      setLoading(true);
      setError(null);
      try {
        const [g, members] = await Promise.all([
          getGroupDetails(groupId),
          getGroupMembers(groupId)
        ]);
        if (!mounted) return;
        setGroup(g);
        setNewName(g?.groupName ?? g?.GroupName ?? g?.name ?? '');
        setMembers(members || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load group details');
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [open, groupId]);

  const [members, setMembers] = useState([]);

  const [showMembers, setShowMembers] = useState(false);

  if (!open) return null;

  const profile = JSON.parse(localStorage.getItem('jwt_profile') || 'null') || {};
  const myUserId = profile?.userId || profile?.UserId || profile?.id || null;
  const creatorId = group?.creatorUserId ?? group?.CreatorUserId ?? null;
  const amCreator = creatorId && myUserId && Number(creatorId) === Number(myUserId);

  async function handleRename(e) {
    e.preventDefault();
    setError(null);
    if (!newName.trim()) return setError('Name required');
    if (newName.trim().length > NAME_MAX) return setError(`Name must be ${NAME_MAX} characters or less`);
    try {
      await renameGroup(groupId, newName.trim(), myUserId);
      if (onRenamed) onRenamed(newName.trim());
      setEditing(false);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Failed to rename');
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this group? This action cannot be undone.')) return;
    try {
      const ok = await deleteGroup(groupId, myUserId);
      if (ok && onDeleted) onDeleted();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Failed to delete group');
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg shadow-lg w-[520px] p-6 z-10">
        <h3 className="text-xl font-semibold mb-3">Group Settings</h3>
        {loading && <div className="text-sm text-gray-500 mb-3">Loading...</div>}
        {error && <div className="text-sm text-red-600 mb-3">{error}</div>}

        <div className="space-y-3">
          <div>
            <div className="text-sm font-medium">Group</div>
            <div className="text-sm text-gray-700">{group?.groupName ?? group?.GroupName ?? '—'}</div>
          </div>

          <div>
            <button className="px-3 py-2 bg-gray-100 rounded" onClick={() => setShowMembers(s => !s)}>{showMembers ? 'Hide users' : 'View users'}</button>
            {showMembers && (
              <div className="mt-3 max-h-40 overflow-y-auto border rounded p-2 bg-gray-50">
                {members.length === 0 ? (
                  <div className="text-sm text-gray-500">No members yet.</div>
                ) : (
                  <ul className="space-y-2">
                    {members.map(m => (
                      <li key={m.userId} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium">{(m.name || m.surname) ? `${(m.name||'').charAt(0)}${(m.surname||'').charAt(0)}` : 'U'}</div>
                        <div className="text-sm">
                          <div className="font-medium">{(m.name || '') + (m.surname ? ` ${m.surname}` : '')}</div>
                          <div className="text-xs text-gray-500">{m.email}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {amCreator && (
            <div className="pt-3 border-t">
              {!editing ? (
                <div className="flex gap-3">
                  <button onClick={() => setEditing(true)} className="px-3 py-2 bg-yellow-400 rounded">Rename group</button>
                  <button onClick={handleDelete} className="px-3 py-2 bg-red-500 text-white rounded">Delete group</button>
                </div>
              ) : (
                <form onSubmit={handleRename} className="flex gap-2 items-center">
                  <input value={newName} onChange={(e) => setNewName(e.target.value.slice(0, NAME_MAX))} maxLength={NAME_MAX} className="flex-1 px-2 py-1 border rounded" />
                  <div className="text-xs text-gray-500">{newName.length}/{NAME_MAX}</div>
                  <button type="submit" className="px-3 py-1 bg-green-600 text-white rounded">Save</button>
                  <button type="button" onClick={() => { setEditing(false); setNewName(group?.groupName ?? ''); }} className="px-3 py-1 border rounded">Cancel</button>
                </form>
              )}
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="px-3 py-2 border rounded">Close</button>
        </div>
      </div>
    </div>
  );
}
