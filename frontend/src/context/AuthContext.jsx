import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Subscribe to Firebase Auth state changes so the session stays in sync.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch the user's role and profile from the backend.
          const { data } = await api.get('/auth/profile');
          setUser({ ...firebaseUser, ...data.user });
          setRole(data.user?.role || null);
        } catch {
          // Profile fetch failed — still treat user as authenticated but
          // without a role so ProtectedRoute can redirect appropriately.
          setUser(firebaseUser);
          setRole(null);
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      // The onAuthStateChanged listener will handle setting user/role.
      // Resolve with the Firebase user so callers can redirect immediately.
      return { success: true, user: credential.user };
    } catch (err) {
      const message = err.message || 'Login failed. Please check your credentials.';
      setError(message);
      return { success: false, error: message };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore backend logout errors.
    }
    await signOut(auth);
    // onAuthStateChanged will clear user/role.
  }, []);

  const forgotPassword = useCallback(async (email) => {
    await sendPasswordResetEmail(auth, email);
  }, []);

  const updateUser = useCallback((updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
  }, []);

  const isAuthenticated = Boolean(user);

  const hasRole = useCallback((...roles) => roles.includes(role), [role]);

  const value = {
    user,
    role,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    forgotPassword,
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
