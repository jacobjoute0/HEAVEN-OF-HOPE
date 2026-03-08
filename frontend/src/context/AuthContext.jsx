import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Restore session from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    const savedRole = localStorage.getItem('role');
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setRole(savedRole);
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password, selectedRole = 'student') => {
    setError(null);
    try {
      const response = await api.post('/auth/login', { email, password, role: selectedRole });
      const { token, user: userData } = response.data;
      const userRole = userData.role || selectedRole;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('role', userRole);
      setUser(userData);
      setRole(userRole);
      return { success: true, role: userRole };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const loginWithToken = useCallback((token, userData, userRole) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('role', userRole);
    setUser(userData);
    setRole(userRole);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore logout API errors
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      setUser(null);
      setRole(null);
    }
  }, []);

  const updateUser = useCallback((updates) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isAuthenticated = Boolean(user);

  const hasRole = useCallback(
    (...roles) => roles.includes(role),
    [role]
  );

  const value = {
    user,
    role,
    loading,
    error,
    isAuthenticated,
    login,
    loginWithToken,
    logout,
    updateUser,
    hasRole,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>');
  return context;
}

export { AuthContext };
export default AuthContext;
