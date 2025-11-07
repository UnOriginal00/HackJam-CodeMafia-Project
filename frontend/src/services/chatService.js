import api from '../../auth/axiosInstance';

// Get full chat history for a group
export async function getHistory(groupId) {
  const res = await api.get(`/chat/${groupId}/history`);
  return res.data || [];
}

// Send a message to a group. Body: { groupID, userID, messageText }
// Returns the created Chat_History object (message id, timestamps, etc.)
export async function sendMessage({ groupID, userID, messageText }) {
  const profile = JSON.parse(localStorage.getItem('jwt_profile') || 'null');
  const body = {
    groupID: Number(groupID),
    userID: Number(userID || profile?.userId || profile?.userId || 1),
    messageText: messageText || ''
  };

  const res = await api.post('/chat/send', body);
  return res.data;
}
