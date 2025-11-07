import api from '../../auth/axiosInstance';

export async function getMyDashboard() {
  const res = await api.get('/dashboard/me');
  return res.data;
}
