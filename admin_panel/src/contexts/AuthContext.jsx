import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import axios from 'axios'; // Added axios import

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Debug: Log environment variables
    console.log('import.meta.env:', import.meta.env);
    console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
    // Check if user is already logged in
    const token = localStorage.getItem('adminToken');
    
    if (token) {
      // Validate token with backend
      validateToken();
    } else {
      setLoading(false);
    }
  }, []);

  const validateToken = async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response.data.data); // Backend returns { success: true, data: user }
    } catch (error) {
      // Token is invalid, clear storage
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}`;
      const loginUrl = `${apiUrl}/auth/admin-login`;
      // Debug: Log the login URL
      console.log('Login URL:', loginUrl);
      const response = await axios.post(
        loginUrl,
        { email, password }
      );
      const { token, user: userData } = response.data;
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminUser', JSON.stringify(userData));
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      loading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 