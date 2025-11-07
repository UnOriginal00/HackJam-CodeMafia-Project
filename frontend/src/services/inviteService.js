import api from '../../auth/axiosInstance';

// Send an invite to a user to join a group
export async function sendInvite({ groupId, recipientUserId, message }) {
  const body = {
    groupId: Number(groupId),
    recipientUserId: Number(recipientUserId),
    message: message || null
  };

  const res = await api.post(`/groups/${groupId}/invite`, body);
  return res.data;
}

export async function getMyInvites() {
  const res = await api.get('/groups/invites/me');
  return res.data || [];
}

export async function acceptInvite(inviteId) {
  const res = await api.post(`/groups/invites/${inviteId}/accept`);
  return res.status === 204 || res.status === 200;
}

export async function declineInvite(inviteId) {
  const res = await api.post(`/groups/invites/${inviteId}/decline`);
  return res.status === 204 || res.status === 200;
}
