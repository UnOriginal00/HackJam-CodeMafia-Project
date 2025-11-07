// API Service for Ideas
// Save this as: frontend/src/services/ideasService.js

const API_BASE_URL = 'http://localhost:7122/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// GET all ideas for a group
export const getAllIdeas = async (groupId = 1) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Ideas/group/${groupId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ideas: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Ideas fetched successfully:', data);
    return data;

  } catch (error) {
    console.error('⚠️ Error fetching ideas from API, using mock data:', error);
    
    // Fallback to mock data if API fails
    return [
      {
        id: 1,
        title: 'Migration of to new IDE',
        content: 'I have recently heard about a new IDE that i believe would assist with our projects what do you guys think of moving our projects to it?',
        userName: 'John Rambo',
        userInitials: 'JR',
        userId: 1,
        groupId: 1,
        tag: 'Software',
        voteCount: 20,
        replyCount: 3,
        createdAt: new Date().toISOString(),
        userHasVoted: false
      },
      {
        id: 2,
        title: 'New management',
        content: 'As we all know our previous group leader has quit so therefor I believe we should host a voting for a new leader on Friday.',
        userName: 'Mike Edwards',
        userInitials: 'ME',
        userId: 2,
        groupId: 1,
        tag: 'Organisation',
        voteCount: 14,
        replyCount: 6,
        createdAt: new Date().toISOString(),
        userHasVoted: false
      }
    ];
  }
};

// POST - Create new idea
export const createIdea = async (ideaData) => {
  try {
    const userId = localStorage.getItem('userId') || 1; // Get from your auth
    
    const response = await fetch(`${API_BASE_URL}/Ideas`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        content: ideaData.content,
        title: ideaData.title,
        groupID: ideaData.groupID || 1,
        userID: userId,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create idea: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Idea created successfully:', result);
    return result;
  } catch (error) {
    console.error('❌ Error creating idea:', error);
    throw error;
  }
};

// PUT - Update idea
export const updateIdea = async (ideaId, ideaData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Ideas/${ideaId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        ideaId: ideaId,
        content: ideaData.content,
        title: ideaData.title,
        userID: ideaData.userID,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update idea: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating idea:', error);
    throw error;
  }
};

// DELETE idea
export const deleteIdea = async (ideaId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Ideas/${ideaId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete idea: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Error deleting idea:', error);
    throw error;
  }
};

// VOTE on an idea
// TODO: Confirm vote endpoint structure with backend
export const toggleVote = async (ideaId, userId) => {
  try {
    // TODO: Uncomment when backend confirms vote endpoint
    // const response = await fetch(`${API_BASE_URL}/Votes`, {
    //   method: 'POST',
    //   headers: getAuthHeaders(),
    //   body: JSON.stringify({
    //     ideaId: ideaId,
    //     userId: userId,
    //   }),
    // });
    // 
    // if (!response.ok) {
    //   throw new Error(`Failed to vote: ${response.status}`);
    // }
    // 
    // return await response.json();

    // TEMPORARY: Just return success until backend is ready
    console.warn('⚠️ Vote feature - waiting for backend Votes endpoint implementation');
    return { success: true };
  } catch (error) {
    console.error('Error voting on idea:', error);
    throw error;
  }
};