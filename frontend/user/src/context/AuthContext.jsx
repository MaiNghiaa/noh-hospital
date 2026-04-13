// frontend/user/src/context/AuthContext.jsx
// Context quản lý trạng thái đăng nhập của bệnh nhân
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('accessToken'));
  const [loading, setLoading] = useState(true);

  // Fetch user info on mount if token exists
  const fetchUser = useCallback(async () => {
    try {
      if (!token) {
        setLoading(false);
        return;
      }
      const res = await authService.getMe();
      setUser(res.user);
    } catch (err) {
      // Token expired or invalid
      console.error('Fetch user failed:', err);
      localStorage.removeItem('accessToken');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    localStorage.setItem('accessToken', res.accessToken);
    setToken(res.accessToken);
    setUser(res.user);
    return res;
  };

  const register = async (data) => {
    const res = await authService.register(data);
    localStorage.setItem('accessToken', res.accessToken);
    setToken(res.accessToken);
    setUser(res.user);
    return res;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      // ignore
    }
    localStorage.removeItem('accessToken');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
    refreshUser: fetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng trong AuthProvider');
  }
  return context;
}

export default AuthContext;
