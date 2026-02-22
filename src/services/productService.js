import api from './api';

export const productService = {

  createProduct: async (productData) => {
    const response = await api.post('admin/products', productData);
    return response.data;
  },

  updateProduct: async(id, productData) => {
    const response = await api.put(`admin/products/${id}`, productData);
    return response.data;
  },


  getAllProducts: async (page = 0, size = 12) => {
    const response = await api.get(`/products?page=${page}&size=${size}`);
    return response.data;
  },

  searchProducts: async (searchData) => {
    const response = await api.post('/products/search', searchData);
    return response.data;
  },

  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  getFeaturedProducts: async () => {
    const response = await api.get('/products/featured');
    return response.data;
  },

  getTopSellingProducts: async () => {
    const response = await api.get('/products/top-selling');
    return response.data;
  },

  getProductsByCategory: async (categoryId, page = 0, size = 12) => {
    const response = await api.get(`/products/category/${categoryId}?page=${page}&size=${size}`);
    return response.data;
  },

    getProductsByCategoryForChat: async (categoryId) => {
    const response = await api.get(`/products/category/${categoryId}`);
    return response.data;
  },

  getProductsByBrand: async (brandId, page = 0, size = 12) => {
    const response = await api.get(`/products/brand/${brandId}?page=${page}&size=${size}`);
    return response.data;
  },
};