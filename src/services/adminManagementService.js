import api from './api';

export const adminManagementService = {
  // Get all admins
  getAllAdmins: async () => {
    const response = await api.get('/admin/admins');
    return response.data;
  },

  // Create new admin
  createAdmin: async (adminData) => {
    const response = await api.post('/admin/admins', adminData);
    return response.data;
  },

  // Update admin
  updateAdmin: async (id, adminData) => {
    const response = await api.put(`/admin/admins/${id}`, adminData);
    return response.data;
  },

  // Delete admin
  deleteAdmin: async (id) => {
    const response = await api.delete(`/admin/admins/${id}`);
    return response.data;
  },
};