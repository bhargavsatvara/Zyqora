import axios from 'axios';

const API_BASE_URL = 'https://zyqora.onrender.com/api';

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
};

// Wishlist API
export const wishlistAPI = {
  getWishlist: () => api.get('/wishlist'),
  addToWishlist: (productId) => api.post('/wishlist', { product_id: productId }),
  removeFromWishlist: (productId) => api.delete(`/wishlist/${productId}`),
};

// Cart API
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (data) => api.post('/cart', data),
  updateCartItem: (itemId, data) => api.put(`/cart/${itemId}`, data),
  removeFromCart: (itemId) => api.delete(`/cart/${itemId}`),
  clearCart: () => api.delete('/cart'),
};

export default api; 