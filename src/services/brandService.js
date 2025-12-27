import api from './api';

export const brandService = {
  getAllBrands: async () => {
    const response = await api.get('/brands');
    return response.data;
  },

  getActiveBrands: async () => {
    const response = await api.get('/brands/active');
    return response.data;
  },

  getBrandById: async (id) => {
    const response = await api.get(`/brands/${id}`);
    return response.data;
  },

  createBrand: async (brandData) => {
    const response = await api.post('/admin/brands', brandData);
    return response.data;
  },

  updateBrand: async (id, brandData) => {
    const response = await api.put(`/admin/brands/${id}`, brandData);
    return response.data;
  },

  deleteBrand: async (id) => {
    const response = await api.delete(`/admin/brands/${id}`);
    return response.data;
  },
};