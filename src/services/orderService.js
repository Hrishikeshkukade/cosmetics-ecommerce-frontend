import api from './api';

export const orderService = {
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  getMyOrders: async (page = 0, size = 10) => {
    const response = await api.get(`/orders/my-orders?page=${page}&size=${size}`);
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  getOrderByOrderNumber: async (orderNumber) => {
    const response = await api.get(`/orders/order-number/${orderNumber}`);
    return response.data;
  },

  cancelOrder: async (id) => {
    const response = await api.put(`/orders/${id}/cancel`);
    return response.data;
  },

  // Admin APIs
  getAllOrders: async (page = 0, size = 10) => {
    const response = await api.get(`/admin/orders?page=${page}&size=${size}`);
    return response.data;
  },

    getOrderStatus: async (status) => {
    const response = await api.get(`/admin/orders/status/${status}`);
    return response.data;
  },

  updateOrderStatus: async (id, status) => {
    const response = await api.put(`/admin/orders/${id}/status`, { status });
    return response.data;
  },

  getOrderStats: async () => {
    const response = await api.get('/admin/stats/orders');
    return response.data;
  },
};