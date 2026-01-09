import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);

      if (data.approvalRequired) {
      setError(data.message);
      setLoading(false);
      return;
    }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const data = await authService.register(userData);

      if (data.approvalRequired) {
      alert(data.message);
      navigate('/login');
      return;
    }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  const isAdmin = () => user?.role === 'ADMIN';

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};