// API Service for Replies
// Save this as: frontend/src/services/repliesService.js

const API_BASE_URL = 'http://localhost:7122/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// GET all replies for an idea
export const getReplies = async (ideaId) => {
  try {
    // TODO: Uncomment when backend adds replies endpoint
    // const response = await fetch(`${API_BASE_URL}/Ideas/${ideaId}/replies`, {
    //   method: 'GET',
    //   headers: getAuthHeaders(),
    // });
    //
    // if (!response.ok) {
    //   throw new Error(`Failed to fetch replies: ${response.status}`);
    // }
    //
    // const data = await response.json();
    // console.log('✅ Replies fetched successfully:', data);
    // return data;

    // TEMPORARY: Return mock data until backend is ready
    console.warn(`⚠️ Using mock replies for idea ${ideaId} - waiting for GET /api/Ideas/{id}/replies endpoint`);
    
    // Mock replies - vary by ideaId for realism
    const mockReplies = {
      1: [
        {
          id: 1,
          ideaId: 1,
          userId: 2,
          userName: 'Sarah Chen',
          userInitials: 'SC',
          avatarUrl: null, // Will show initials
          content: 'This sounds like a great idea! Which IDE are you thinking about?',
          createdAt: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
        },
        {
          id: 2,
          ideaId: 1,
          userId: 3,
          userName: 'Mike Johnson',
          userInitials: 'MJ',
          avatarUrl: null, // Will show initials
          content: 'I agree! We should evaluate the performance benefits.',
          createdAt: new Date(Date.now() - 1800000).toISOString() // 30 min ago
        }
      ],
      2: [
        {
          id: 3,
          ideaId: 2,
          userId: 1,
          userName: 'John Rambo',
          userInitials: 'JR',
          avatarUrl: null, // Will show initials
          content: 'Friday works for me. Should we create a poll?',
          createdAt: new Date(Date.now() - 7200000).toISOString() // 2 hours ago
        }
      ]
    };

    return mockReplies[ideaId] || [];
  } catch (error) {
    console.error('Error fetching replies:', error);
    throw error;
  }
};

// POST - Create new reply
export const createReply = async (ideaId, replyData) => {
  try {
    const userId = localStorage.getItem('userId') || 1;
    
    // TODO: Uncomment when backend adds replies endpoint
    // const response = await fetch(`${API_BASE_URL}/Ideas/${ideaId}/replies`, {
    //   method: 'POST',
    //   headers: getAuthHeaders(),
    //   body: JSON.stringify({
    //     userId: userId,
    //     content: replyData.content,
    //   }),
    // });
    //
    // if (!response.ok) {
    //   const errorText = await response.text();
    //   throw new Error(`Failed to create reply: ${response.status} - ${errorText}`);
    // }
    //
    // const result = await response.json();
    // console.log('✅ Reply created successfully:', result);
    // return result;

    // TEMPORARY: Return mock created reply
    console.warn(`⚠️ Mock reply created for idea ${ideaId} - waiting for POST /api/Ideas/{id}/replies endpoint`);
    
    return {
      id: Date.now(),
      ideaId: ideaId,
      userId: userId,
      userName: 'You',
      userInitials: 'YOU',
      content: replyData.content,
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ Error creating reply:', error);
    throw error;
  }
};

// DELETE a reply
export const deleteReply = async (ideaId, replyId) => {
  try {
    // TODO: Uncomment when backend adds delete endpoint
    // const response = await fetch(`${API_BASE_URL}/Ideas/${ideaId}/replies/${replyId}`, {
    //   method: 'DELETE',
    //   headers: getAuthHeaders(),
    // });
    //
    // if (!response.ok) {
    //   throw new Error(`Failed to delete reply: ${response.status}`);
    // }
    //
    // return true;

    // TEMPORARY: Just return success
    console.warn(`⚠️ Mock delete reply ${replyId} - waiting for DELETE endpoint`);
    return true;
  } catch (error) {
    console.error('Error deleting reply:', error);
    throw error;
  }
};