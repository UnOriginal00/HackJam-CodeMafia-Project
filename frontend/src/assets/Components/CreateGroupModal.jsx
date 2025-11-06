import React, { useState } from 'react';
import { createGroup } from '../../services/groupsService';

export default function CreateGroupModal({ open, onClose, onCreated }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!open) return null;

  async function submit(e) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return setError('Group name is required');
    setSubmitting(true);
    try {
      const created = await createGroup({ groupName: name.trim(), description: description.trim() });
      if (onCreated) onCreated(created);
      setName('');
      setDescription('');
    } catch (err) {
      console.error('Failed to create group', err);
      setError(err?.response?.data?.message || err.message || 'Failed to create group');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <form onSubmit={submit} className="relative bg-white rounded-lg shadow-xl w-[520px] p-6 z-10">
        <h3 className="text-xl font-semibold mb-4">Create a new group</h3>
        <label className="block text-sm mb-2">Group name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded mb-3" placeholder="My Project Team" />

        <label className="block text-sm mb-2">Description (optional)</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border rounded mb-3" rows={3} placeholder="Short description" />

        {error && <div className="text-sm text-red-600 mb-2">{error}</div>}

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} disabled={submitting} className="px-4 py-2 rounded border">Cancel</button>
          <button type="submit" disabled={submitting} className="px-4 py-2 rounded bg-purple-600 text-white">{submitting ? 'Creating...' : 'Create'}</button>
        </div>
      </form>
    </div>
  );
}
