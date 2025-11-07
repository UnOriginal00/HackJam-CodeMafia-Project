import api from '../../auth/axiosInstance';

// Fetch groups for the current authenticated user
export async function getMyGroups() {
  const res = await api.get('/groups/me');
  // backend returns array of Group_List objects; normalize to a lightweight DTO
  return (res.data || []).map(g => ({
    groupId: g.groupId || g.group_id || g.GroupId,
    name: g.groupName || g.group_name || g.GroupName || g.name,
    description: g.description || null,
    // role isn't currently returned by backend; keep undefined if missing
    role: g.role ?? null
  }));
}

export async function getGroupsForUser(userId) {
  const res = await api.get(`/groups/user/${userId}`);
  return (res.data || []).map(g => ({
    groupId: g.groupId || g.group_id || g.GroupId,
    name: g.groupName || g.group_name || g.GroupName || g.name,
    description: g.description || null,
    role: g.role ?? null
  }));
}

// Create a new group. Payload: { groupName, description, creatorUserID? }
export async function createGroup(payload) {
  const profile = JSON.parse(localStorage.getItem('jwt_profile') || 'null') || {};
  const body = {
    creatorUserID: Number(payload.creatorUserID || profile?.userId || profile?.UserId || profile?.id || 1),
    groupName: payload.groupName,
    description: payload.description || ''
  };

  const res = await api.post('/groups', body);
  return res.data;
}

// Get group details by id (returns Group_List shape)
export async function getGroupDetails(groupId) {
  const res = await api.get(`/groups/${groupId}`);
  return res.data;
}

export async function getGroupMembers(groupId) {
  const res = await api.get(`/groups/${groupId}/members`);
  return (res.data || []).map(m => ({
    userId: m.userId ?? m.UserId ?? m.UserID,
    name: m.name ?? m.Name ?? '',
    surname: m.surname ?? m.Surname ?? '',
    email: m.email ?? m.Email ?? '',
    joinedAt: m.joinedAt ?? m.JoinedAt ?? null
  }));
}

// Rename group (caller should be the creator)
export async function renameGroup(groupId, newName, creatorUserID) {
  const body = { creatorUserID: Number(creatorUserID), groupID: Number(groupId), newName };
  const res = await api.put(`/groups/${groupId}/rename`, body);
  return res.status === 204;
}

// Delete group (caller should be the creator)
export async function deleteGroup(groupId, creatorUserID) {
  const body = { creatorUserID: Number(creatorUserID), groupID: Number(groupId) };
  const res = await api.request({ url: `/groups/${groupId}`, method: 'DELETE', data: body });
  return res.status === 204;
}
