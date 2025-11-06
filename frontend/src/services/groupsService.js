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
