import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export const MOCK_USERS = {
  candidate: {
    id: '6a78616fe67c00a12fd30f03',
    _id: '6a78616fe67c00a12fd30f03',
    name: 'Alex Rivera',
    email: 'candidate@interviewai.com',
    role: 'candidate',
    profile: {
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      phone: '+1 (555) 234-5678',
      location: 'San Francisco, CA',
      bio: 'Passionate Full Stack Developer with 3+ years experience building modern cloud web applications with React, Node.js, and MongoDB.',
      college: 'University of California, Berkeley',
      degree: 'B.S. Computer Science',
      graduationYear: 2023,
      experienceLevel: '1-3 years',
      currentRole: 'Software Developer',
      targetRole: 'Full Stack Developer',
      skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'Docker', 'Git', 'REST API'],
      github: 'https://github.com/alexrivera-dev',
      linkedin: 'https://linkedin.com/in/alexrivera-dev',
      portfolio: 'https://alexrivera.dev'
    },
    stats: {
      totalInterviews: 12,
      completedInterviews: 10,
      averageScore: 84,
      bestScore: 95,
      currentStreak: 4,
      lastInterviewDate: new Date().toISOString()
    },
    profileCompletion: 90
  },
  admin: {
    id: '6a78616ee67c00a12fd30f01',
    _id: '6a78616ee67c00a12fd30f01',
    name: 'Super Admin',
    email: 'admin@interviewai.com',
    role: 'admin',
    profile: {
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80',
      phone: '+1 (555) 999-0000',
      location: 'San Francisco, CA',
      bio: 'Chief System Administrator & AI Evaluator',
      targetRole: 'Software Architect',
      skills: ['Architecture', 'System Design', 'AI Engineering', 'Full Stack']
    },
    stats: {
      totalInterviews: 0,
      completedInterviews: 0,
      averageScore: 0,
      bestScore: 0,
      currentStreak: 0
    },
    profileCompletion: 100
  }
};

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
        // If this is a dev mock token, keep the cached user session
        if (token.startsWith('dev_mock_token_')) {
          setLoading(false);
          return;
        }

        try {
          console.groupCollapsed('🔍 [Auth Debug] Checking user session (/auth/me)');
          const { data } = await api.get('/auth/me');
          console.log('Session response:', data);
          console.groupEnd();
          if (data.success) {
            setUser(data.data.user);
            localStorage.setItem('interview_ai_user', JSON.stringify(data.data.user));
          }
        } catch (err) {
          console.warn('Session verification failed or backend unreachable:', err.message);
          console.groupEnd();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Direct Mock Login for testing / dev bypass
  const loginWithMock = (role = 'candidate') => {
    const mockUser = role === 'admin' ? MOCK_USERS.admin : MOCK_USERS.candidate;
    const mockAccessToken = `dev_mock_token_${role}_${Date.now()}`;
    const mockRefreshToken = `dev_mock_refresh_${role}_${Date.now()}`;

    console.group(`⚡ [Auth Debug] Instant Mock Login (${role})`);
    console.log('Mock User Profile:', mockUser);
    console.groupEnd();

    localStorage.setItem('interview_ai_access_token', mockAccessToken);
    localStorage.setItem('interview_ai_refresh_token', mockRefreshToken);
    localStorage.setItem('interview_ai_user', JSON.stringify(mockUser));
    setUser(mockUser);
    toast.success(`Welcome to Dev Mode, ${mockUser.name}!`);
    return mockUser;
  };

  const login = async (email, password) => {
    console.group(`🔐 [Auth Debug] Login Attempt: ${email}`);
    console.log('📤 Submitting payload:', {
      email,
      passwordLength: password ? password.length : 0,
      timestamp: new Date().toISOString()
    });

    try {
      const { data } = await api.post('/auth/login', { email, password });
      console.log('📥 Backend Auth Response (200 OK):', data);
      console.groupEnd();

      if (data.success) {
        const { user: userData, accessToken, refreshToken } = data.data;
        localStorage.setItem('interview_ai_access_token', accessToken);
        localStorage.setItem('interview_ai_refresh_token', refreshToken);
        localStorage.setItem('interview_ai_user', JSON.stringify(userData));
        setUser(userData);
        toast.success(`Welcome back, ${userData.name}!`);
        return userData;
      }
    } catch (err) {
      const isNetworkOrProxyError =
        err.code === 'ERR_NETWORK' ||
        !err.response ||
        err.response?.status === 502 ||
        err.response?.status === 504 ||
        (err.response?.status === 500 && !err.response?.data?.message);

      console.error('❌ Backend Auth Error Details:', {
        httpStatus: err.response?.status,
        statusText: err.response?.statusText,
        responseData: err.response?.data,
        errorCode: err.code,
        errorMessage: err.message,
        isNetworkOrProxyError
      });
      console.groupEnd();

      // Dev Fallback: If backend is offline or default demo credentials were typed, allow mock login
      const isDemoCandidate = email.toLowerCase() === 'candidate@interviewai.com';
      const isDemoAdmin = email.toLowerCase() === 'admin@interviewai.com';

      if (isNetworkOrProxyError && (isDemoCandidate || isDemoAdmin)) {
        console.warn('⚠️ Backend offline. Activating Dev Mock Login fallback for demo credentials.');
        toast('Backend offline. Logged in with Dev Mock Mode.', { icon: '⚡' });
        return loginWithMock(isDemoAdmin ? 'admin' : 'candidate');
      }

      throw err;
    }
  };

  const register = async (name, email, password, confirmPassword) => {
    console.group(`📝 [Auth Debug] Register Attempt: ${email}`);
    console.log('📤 Submitting registration payload:', { name, email, passwordLength: password?.length });

    try {
      const { data } = await api.post('/auth/register', {
        name,
        email,
        password,
        confirmPassword
      });
      console.log('📥 Backend Register Response:', data);
      console.groupEnd();

      if (data.success) {
        const { user: userData, accessToken, refreshToken } = data.data;
        localStorage.setItem('interview_ai_access_token', accessToken);
        localStorage.setItem('interview_ai_refresh_token', refreshToken);
        localStorage.setItem('interview_ai_user', JSON.stringify(userData));
        setUser(userData);
        toast.success('Account created successfully!');
        return userData;
      }
    } catch (err) {
      console.error('❌ Backend Register Error:', {
        httpStatus: err.response?.status,
        responseData: err.response?.data,
        message: err.message
      });
      console.groupEnd();
      throw err;
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('interview_ai_refresh_token');
      if (refreshToken && !refreshToken.startsWith('dev_mock_')) {
        await api.post('/auth/logout', { refreshToken });
      }
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
        loginWithMock,
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
