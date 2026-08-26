import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('interview_ai_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Sync user profile from server on initial load if token exists
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('interview_ai_access_token');
      if (token) {
        try {
          const { data } = await api.get('/auth/me');
          if (data.success) {
            setUser(data.data.user);
            localStorage.setItem('interview_ai_user', JSON.stringify(data.data.user));
          }
        } catch {
          // Token expired or invalid, handled by interceptor or clean up
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.success) {
      const { user: userData, accessToken, refreshToken } = data.data;
      localStorage.setItem('interview_ai_access_token', accessToken);
      localStorage.setItem('interview_ai_refresh_token', refreshToken);
      localStorage.setItem('interview_ai_user', JSON.stringify(userData));
      setUser(userData);
      toast.success(`Welcome back, ${userData.name}!`);
      return userData;
    }
  };

  const register = async (name, email, password, confirmPassword) => {
    const { data } = await api.post('/auth/register', {
      name,
      email,
      password,
      confirmPassword
    });
    if (data.success) {
      const { user: userData, accessToken, refreshToken } = data.data;
      localStorage.setItem('interview_ai_access_token', accessToken);
      localStorage.setItem('interview_ai_refresh_token', refreshToken);
      localStorage.setItem('interview_ai_user', JSON.stringify(userData));
      setUser(userData);
      toast.success('Account created successfully!');
      return userData;
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('interview_ai_refresh_token');
      await api.post('/auth/logout', { refreshToken });
    } catch (e) {
      // Ignore network errors during logout
    } finally {
      localStorage.removeItem('interview_ai_access_token');
      localStorage.removeItem('interview_ai_refresh_token');
      localStorage.removeItem('interview_ai_user');
      setUser(null);
      toast.success('Logged out successfully');
    }
  };

  const updateUser = (updatedData) => {
    setUser((prev) => {
      const next = { ...prev, ...updatedData };
      localStorage.setItem('interview_ai_user', JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
