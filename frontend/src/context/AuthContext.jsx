import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('bcr_token'));
  const [loading, setLoading] = useState(true);

  // Load user on mount if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await authAPI.getProfile();
          setUser(res.data.data.user);
        } catch (error) {
          console.error('Failed to load user:', error);
          logout();
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { user: userData, token: newToken } = res.data.data;

    localStorage.setItem('bcr_token', newToken);
    localStorage.setItem('bcr_user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);

    return res.data;
  };

  const register = async (formData) => {
    const res = await authAPI.register(formData);
    const { user: userData, token: newToken } = res.data.data;

    localStorage.setItem('bcr_token', newToken);
    localStorage.setItem('bcr_user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);

    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('bcr_token');
    localStorage.removeItem('bcr_user');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (data) => {
    const res = await authAPI.updateProfile(data);
    const updatedUser = res.data.data.user;
    setUser(updatedUser);
    localStorage.setItem('bcr_user', JSON.stringify(updatedUser));
    return res.data;
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
