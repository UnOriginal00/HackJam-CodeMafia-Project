import React from 'react';
import { X, UserPlus } from 'lucide-react';
import { sendInvite } from '../../services/inviteService';

export default function InviteModal({ open, onClose, groupId, onSent }) {
  const [recipientUserId, setRecipientUserId] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (!open) {
      setRecipientUserId('');
      setMessage('');
      setError(null);
      setLoading(false);
    }
  }, [open]);

  if (!open) return null;

  const handleSend = async () => {
    setError(null);
    if (!groupId) return setError('Select a group first or open this from within a group.');
    if (!recipientUserId || Number.isNaN(Number(recipientUserId))) return setError('Please enter a numeric recipient user id.');

    setLoading(true);
    try {
      const invite = await sendInvite({ groupId: Number(groupId), recipientUserId: Number(recipientUserId), message });
      setLoading(false);
      if (onSent) onSent(invite);
    } catch (err) {
      setLoading(false);
      const msg = err?.response?.data?.message || err?.message || 'Failed to send invite.';
      setError(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-black" />
            <div className="font-medium">Invite to group</div>
          </div>
          <button onClick={onClose} className="p-1 text-gray-600 hover:text-black"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-4 space-y-3">
          <div className="text-sm text-gray-700">Group: <span className="font-medium">{groupId ?? '—'}</span></div>

          <label className="block">
            <div className="text-xs text-gray-600 mb-1">Recipient User ID</div>
            <input value={recipientUserId} onChange={e => setRecipientUserId(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="e.g. 42" />
          </label>

          <label className="block">
            <div className="text-xs text-gray-600 mb-1">Message (optional)</div>
            <textarea value={message} onChange={e => setMessage(e.target.value)} className="w-full border rounded px-3 py-2" rows={3} placeholder="Add a short note" />
          </label>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex items-center justify-end gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded border">Cancel</button>
            <button onClick={handleSend} disabled={loading} className="px-4 py-2 rounded bg-purple-500 text-white hover:bg-purple-600">
              {loading ? 'Sending...' : 'Send Invite'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
