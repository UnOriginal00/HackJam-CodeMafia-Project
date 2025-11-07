import api from '../../auth/axiosInstance';

// Fetch all ideas for a group
export async function getAllIdeas(groupId) {
  const res = await api.get(`/ideas/group/${groupId}`);
  return res.data || [];
}

// Fetch personal ideas for the authenticated user
export async function getMyIdeas() {
  const res = await api.get('/ideas/me');
  return res.data || [];
}

// Create a new idea. Expects { title, content, groupID, userID }
export async function createIdea(payload) {
  // ensure userID exists
  if (!payload.userID) {
    const profile = JSON.parse(localStorage.getItem('jwt_profile') || 'null');
    payload.userID = profile?.userId || 1;
  }

  const res = await api.post('/ideas', payload);
  return res.data;
}

// Toggle vote for an idea. Sends voteType 'up' (frontend treats it as toggle)
export async function toggleVote(ideaId, userId) {
  const body = { userID: Number(userId || (JSON.parse(localStorage.getItem('jwt_profile') || 'null')?.userId || 1)), ideaID: Number(ideaId), voteType: 'up' };
  const res = await api.post('/votes', body);
  return res.data;
}
