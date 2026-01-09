import api from './api';

export const userApprovalService = {
  // Get all users
  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  // Get pending users
  getPendingUsers: async () => {
    const response = await api.get('/admin/users/pending');
    return response.data;
  },

  // Approve user
  approveUser: async (userId) => {
    const response = await api.post(`/admin/users/${userId}/approve`);
    return response.data;
  },

  // Reject user
  rejectUser: async (userId, reason) => {
    const response = await api.post(`/admin/users/${userId}/reject`, { reason });
    return response.data;
  },

  // Get user statistics
  getUserStats: async () => {
    const response = await api.get('/admin/users/stats');
    return response.data;
  },
};