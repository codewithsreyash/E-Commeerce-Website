import axios from 'axios';

export const TOKEN_KEY = 'shopping_admin_token';
export const USER_KEY = 'shopping_admin_user';

const api = axios.create({
  baseURL: 'http://localhost:8081/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export const login = async (payload) => {
  const response = await api.post('/auth/login', payload);
  localStorage.setItem(TOKEN_KEY, response.data.token);
  localStorage.setItem(USER_KEY, JSON.stringify({ username: response.data.username, role: response.data.role }));
  return response.data;
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const isAuthenticated = () => Boolean(localStorage.getItem(TOKEN_KEY));
export const getStoredUser = () => {
  const value = localStorage.getItem(USER_KEY);
  return value ? JSON.parse(value) : null;
};

export const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

// Admin endpoints
export const getDashboardStats = () => api.get('/admin/dashboard/stats');
export const getProducts = (params) => api.get('/admin/products', { params });
export const createProduct = (payload) => api.post('/admin/products', payload);
export const updateProduct = (id, payload) => api.put(`/admin/products/${id}`, payload);
export const deleteProduct = (id) => api.delete(`/admin/products/${id}`);
export const getOrders = (params) => api.get('/admin/orders', { params });
export const getOrdersWithDetails = (params) => api.get('/admin/orders/details', { params });
export const createOrder = (payload) => api.post('/admin/orders', payload);
export const updateOrder = (id, payload) => api.put(`/admin/orders/${id}`, payload);
export const deleteOrder = (id) => api.delete(`/admin/orders/${id}`);
export const getOrderRevenue = (params) => api.get('/admin/orders/revenue', { params });
export const getCustomers = (params) => api.get('/admin/customers', { params });

export default api;
