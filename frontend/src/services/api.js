import axios from 'axios';

const API_BASE_URL = 'https://zyqora.onrender.com/api';
// const API_BASE_URL = 'http://localhost:4000/api';

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
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  signup: (data) => api.post('/auth/signup', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (token, data) => api.post(`/auth/reset-password/${token}`, data),
  verifyEmail: (data) => api.post('/auth/verify-email', data),
};

// Products API
export const productsAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  getFeaturedProducts: () => api.get('/products/featured'),
  searchProducts: (query) => api.get('/products/search', { params: { query } }),
};

// Categories API
export const categoriesAPI = {
  getCategories: (params) => api.get('/categories', { params }),
  getCategory: (id) => api.get(`/categories/${id}`),
};

// Brands API
export const brandsAPI = {
  getBrands: (params) => api.get('/brands', { params }),
  getBrand: (id) => api.get(`/brands/${id}`),
};

// Departments API
export const departmentsAPI = {
  getDepartments: (params) => api.get('/departments', { params }),
  getDepartment: (id) => api.get(`/departments/${id}`),
};

// Reviews API
export const reviewsAPI = {
  getProductReviews: (productId) => api.get(`/reviews/${productId}`),
  createReview: (data) => api.post('/reviews', data),
  addReview: (data) => api.post('/reviews/add', data),
};

// Wishlist API
export const wishlistAPI = {
  getWishlist: () => api.get('/wishlist'),
  addToWishlist: (productId) => api.post('/wishlist', { product_id: productId }),
  addToWishlistAlt: (data) => api.post('/wishlist/add', data),
  removeFromWishlist: (productId) => api.delete(`/wishlist/${productId}`),
  removeFromWishlistAlt: (productId) => api.delete(`/wishlist/remove/${productId}`),
};

// Cart API
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (data) => api.post('/cart', data),
  addToCartAlt: (data) => api.post('/cart/add', data),
  updateCartItem: (itemId, data) => api.put(`/cart/${itemId}`, data),
  updateCartItemAlt: (data) => api.post('/cart/update', data),
  removeFromCart: (itemId) => api.delete(`/cart/${itemId}`),
  removeFromCartAlt: (data) => api.post('/cart/remove', data),
  clearCart: () => api.delete('/cart'),
  clearCartAlt: () => api.post('/cart/clear'),
};

// Orders API
export const ordersAPI = {
  getOrders: () => api.get('/orders'),
  getOrder: (id) => api.get(`/orders/${id}`),
  createOrder: (data) => api.post('/orders/create', data),
  checkout: (data) => api.post('/orders/checkout', data),
  updateOrderStatus: (id, data) => api.put(`/orders/${id}/status`, data),
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  updatePassword: (data) => api.put('/user/password', data),
  getAddresses: () => api.get('/user/address'),
  createAddress: (data) => api.post('/user/address', data),
  updateAddress: (id, data) => api.put(`/user/address/${id}`, data),
  deleteAddress: (id) => api.delete(`/user/address/${id}`),
};

// Addresses API
export const addressesAPI = {
  getAddresses: () => api.get('/addresses'),
  createAddress: (data) => api.post('/addresses', data),
  updateAddress: (id, data) => api.put(`/addresses/${id}`, data),
  deleteAddress: (id) => api.delete(`/addresses/${id}`),
};

// Countries API
export const countriesAPI = {
  getCountries: () => api.get('/countries'),
  getCountry: (id) => api.get(`/countries/${id}`),
};

// States API
export const statesAPI = {
  getStates: (params) => api.get('/states', { params }),
  getState: (id) => api.get(`/states/${id}`),
};

// Cities API
export const citiesAPI = {
  getCities: (params) => api.get('/cities', { params }),
  getCity: (id) => api.get(`/cities/${id}`),
};

// Colors API
export const colorsAPI = {
  getColors: (params) => api.get('/colors', { params }),
  getColor: (id) => api.get(`/colors/${id}`),
};

// Sizes API
export const sizesAPI = {
  getSizes: (params) => api.get('/sizes', { params }),
  getSize: (id) => api.get(`/sizes/${id}`),
};

// Materials API
export const materialsAPI = {
  getMaterials: (params) => api.get('/materials', { params }),
  getMaterial: (id) => api.get(`/materials/${id}`),
};

// Coupons API
export const couponsAPI = {
  getCoupons: (params) => api.get('/coupons', { params }),
  getCoupon: (id) => api.get(`/coupons/${id}`),
  validateCoupon: (code) => api.post('/coupons/validate', { code }),
};

export default api; 