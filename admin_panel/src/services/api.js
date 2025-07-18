import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      // Don't redirect here, let the AuthContext handle it
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) =>
    api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/admin/dashboard'),
  getSalesAnalytics: (period) => 
    api.get(`/admin/analytics/sales?period=${period}`),
};

// Users API
export const usersAPI = {
  getUsers: (params) =>
    api.get('/admin/users', { params }),
  updateUserRole: (userId, role) =>
    api.put(`/admin/users/${userId}/role`, { role }),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  addUser: (data) => api.post('/auth/signup', data),
};

// Products API
export const productsAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  createProduct: (data, isMultipart) =>
    isMultipart
      ? api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } })
      : api.post('/products', data),
  updateProduct: (id, data, isMultipart) =>
    isMultipart
      ? api.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
      : api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  bulkDelete: (productIds) => api.post('/products/bulk-delete', { productIds }),
};

// Orders API
export const ordersAPI = {
  getOrders: (params) => api.get('/orders', { params }),
  getOrder: (id) => api.get(`/orders/${id}`),
  updateOrderStatus: (id, status) =>
    api.put(`/orders/${id}/status`, { status }),
  deleteOrder: (id) => api.delete(`/orders/${id}`),
};

// Categories API
export const categoriesAPI = {
  getCategories: (params) => api.get('/categories', { params }),
  getCategory: (id) => api.get(`/categories/${id}`),
  createCategory: (data) => api.post('/categories', data),
  updateCategory: (id, data) => api.put(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
};

// Brands API
export const brandsAPI = {
  getBrands: (params) => api.get('/brands', { params }),
  getBrand: (id) => api.get(`/brands/${id}`),
  createBrand: (data) => api.post('/brands', data),
  updateBrand: (id, data) => api.put(`/brands/${id}`, data),
  deleteBrand: (id) => api.delete(`/brands/${id}`),
};

// Coupons API
export const couponsAPI = {
  getCoupons: (params) => api.get('/coupons', { params }),
  getCoupon: (id) => api.get(`/coupons/${id}`),
  createCoupon: (data) => api.post('/coupons', data),
  updateCoupon: (id, data) => api.put(`/coupons/${id}`, data),
  deleteCoupon: (id) => api.delete(`/coupons/${id}`),
};

// Reviews API
export const reviewsAPI = {
  getReviews: (params) => api.get('/reviews', { params }),
  getReview: (id) => api.get(`/reviews/${id}`),
  approveReview: (id) => api.put(`/admin/reviews/${id}/approve`),
  deleteReview: (id) => api.delete(`/admin/reviews/${id}`),
};

// Departments API
export const departmentsAPI = {
  getDepartments: (params) => api.get('/departments', { params }),
  getDepartment: (id) => api.get(`/departments/${id}`),
  createDepartment: (data) => api.post('/departments', data),
  updateDepartment: (id, data) => api.put(`/departments/${id}`, data),
  deleteDepartment: (id) => api.delete(`/departments/${id}`),
};

// Countries API
export const countriesAPI = {
  getCountries: (params) => api.get('/countries', { params }),
  getCountry: (id) => api.get(`/countries/${id}`),
  createCountry: (data) => api.post('/countries', data),
  updateCountry: (id, data) => api.put(`/countries/${id}`, data),
  deleteCountry: (id) => api.delete(`/countries/${id}`),
};

// States API
export const statesAPI = {
  getStates: (params) => api.get('/states', { params }),
  getState: (id) => api.get(`/states/${id}`),
  createState: (data) => api.post('/states', data),
  updateState: (id, data) => api.put(`/states/${id}`, data),
  deleteState: (id) => api.delete(`/states/${id}`),
};

// Cities API
export const citiesAPI = {
  getCities: (params) => api.get('/cities', { params }),
  getCity: (id) => api.get(`/cities/${id}`),
  createCity: (data) => api.post('/cities', data),
  updateCity: (id, data) => api.put(`/cities/${id}`, data),
  deleteCity: (id) => api.delete(`/cities/${id}`),
};

// Colors API
export const colorsAPI = {
  getColors: (params) => api.get('/colors', { params }),
};

// Sizes API
export const sizesAPI = {
  getSizes: (params) => api.get('/sizes', { params }),
  getSize: (id) => api.get(`/sizes/${id}`),
  createSize: (data) => api.post('/sizes', data),
  updateSize: (id, data) => api.put(`/sizes/${id}`, data),
  deleteSize: (id) => api.delete(`/sizes/${id}`),
};

// Materials API
export const materialsAPI = {
  getMaterials: (params) => api.get('/materials', { params }),
  getMaterial: (id) => api.get(`/materials/${id}`),
  createMaterial: (data) => api.post('/materials', data),
  updateMaterial: (id, data) => api.put(`/materials/${id}`, data),
  deleteMaterial: (id) => api.delete(`/materials/${id}`),
};

// Settings API
export const settingsAPI = {
  getSystemStats: () => api.get('/admin/settings'),
};

export const productMaterialsAPI = {
  getProductMaterials: (params) => api.get('/product-materials', { params }),
  getProductMaterial: (id) => api.get(`/product-materials/${id}`),
  createProductMaterial: (data) => api.post('/product-materials', data),
  updateProductMaterial: (id, data) => api.put(`/product-materials/${id}`, data),
  deleteProductMaterial: (id) => api.delete(`/product-materials/${id}`),
};

export const productSizesAPI = {
  getProductSizes: (params) => api.get('/product-sizes', { params }),
  getProductSize: (id) => api.get(`/product-sizes/${id}`),
  createProductSize: (data) => api.post('/product-sizes', data),
  updateProductSize: (id, data) => api.put(`/product-sizes/${id}`, data),
  deleteProductSize: (id) => api.delete(`/product-sizes/${id}`),
};

export const productColorsAPI = {
  getProductColors: (params) => api.get('/product-colors', { params }),
  getProductColor: (id) => api.get(`/product-colors/${id}`),
  createProductColor: (data) => api.post('/product-colors', data),
  updateProductColor: (id, data) => api.put(`/product-colors/${id}`, data),
  deleteProductColor: (id) => api.delete(`/product-colors/${id}`),
};

export default api; 