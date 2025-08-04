import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Clear any error messages after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await authService.getProfile();
      setUser(response.data);
      return response.data;
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    // Check if user is logged in on page load
    const checkLoggedIn = async () => {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      if (token) {
        await fetchUserProfile();
      }
      
      setLoading(false);
      setAuthChecked(true);
    };

    checkLoggedIn();
  }, [fetchUserProfile]);

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await authService.login(email, password);
      const { access_token, refresh_token } = response.data;
      
      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);
      
      // Fetch user profile after login
      const userData = await fetchUserProfile();
      setLoading(false);
      return !!userData;
    } catch (err) {
      setLoading(false);
      
      // Better error handling
      let errorMessage = 'Login failed. Please try again.';
      
      if (err.code === 'NETWORK_ERROR' || err.message === 'Network Error') {
        errorMessage = 'Server is currently unavailable. Please try again in a few minutes.';
      } else if (err.response?.status === 502 || err.response?.status === 503) {
        errorMessage = 'Server is temporarily down. Please try again later.';
      } else if (err.response?.status === 401) {
        errorMessage = err.response?.data?.message || 'Invalid email or password.';
      } else if (err.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setError(errorMessage);
      return false;
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    // Don't remove remembered email as that's a user preference
  }, []);

  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      await authService.register(userData);
      setLoading(false);
      return true;
    } catch (err) {
      setLoading(false);
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      return false;
    }
  };
  
  const updateProfile = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      // This would need to be implemented in your API service
      // const response = await userService.updateProfile(userData);
      // setUser(response.data);
      setLoading(false);
      return true;
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to update profile');
      return false;
    }
  };

  const refreshUser = useCallback(async () => {
    if (user) {
      await fetchUserProfile();
    }
  }, [user, fetchUserProfile]);

  const value = {
    user,
    loading,
    error,
    authChecked,
    login,
    logout,
    register,
    updateProfile,
    refreshUser,
    setError,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};