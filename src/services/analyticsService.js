import api from './api';

export const analyticsService = {
  // Sales trends
  getSalesTrend: async (days = 30) => {
    const response = await api.get(`/admin/analytics/sales-trend?days=${days}`);
    return response.data;
  },

  // Top products
  getTopProducts: async (limit = 10) => {
    const response = await api.get(`/admin/analytics/top-products?limit=${limit}`);
    return response.data;
  },

  // Category distribution
  getCategoryDistribution: async () => {
    const response = await api.get('/admin/analytics/category-distribution');
    return response.data;
  },

  // Revenue summary
  getRevenueSummary: async () => {
    const response = await api.get('/admin/analytics/revenue-summary');
    return response.data;
  },

  // Brand performance
  getBrandPerformance: async () => {
    const response = await api.get('/admin/analytics/brand-performance');
    return response.data;
  },

  // Dashboard stats
  getDashboardStats: async () => {
    const response = await api.get('/admin/analytics/dashboard-stats');
    return response.data;
  },

  // Order status distribution
  getOrderStatusDistribution: async () => {
    const response = await api.get('/admin/analytics/order-status-distribution');
    return response.data;
  },

  // Monthly comparison
  getMonthlySalesComparison: async (months = 6) => {
    const response = await api.get(`/admin/analytics/monthly-comparison?months=${months}`);
    return response.data;
  },
};