import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../config/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen for Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Force refresh token to get custom claims
          const token = await firebaseUser.getIdTokenResult(true);

          const userRole = token.claims.role || null;

          console.log("Logged user:", firebaseUser.email);
          console.log("User role:", userRole);

          setUser(firebaseUser);
          setRole(userRole);
        } catch (err) {
          console.error("Error reading role:", err);
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

  // Login
  // expectedRole: optional hint passed by role-specific login pages (e.g. 'student').
  // If provided, the user's actual Firebase custom-claim role must match it; otherwise
  // the session is cancelled and a helpful error is returned.
  const login = useCallback(async (email, password, expectedRole = null) => {
    setError(null);

    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);

      // Immediately fetch custom claims so role is available before navigate()
      const token = await credential.user.getIdTokenResult(true);
      const userRole = token.claims.role || null;

      // Reject login if the account role doesn't match this portal's expected role
      if (expectedRole && userRole !== expectedRole) {
        await signOut(auth);
        const label = expectedRole.charAt(0).toUpperCase() + expectedRole.slice(1);
        const message = `This is not a ${label} account. Please use the correct login portal.`;
        setError(message);
        return { success: false, error: message };
      }

      setUser(credential.user);
      setRole(userRole);

      return {
        success: true,
        user: credential.user,
        role: userRole,
      };
    } catch (err) {
      const message = err.message || "Login failed";
      setError(message);

      return {
        success: false,
        error: message,
      };
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    await signOut(auth);
  }, []);

  // Reset password
  const forgotPassword = useCallback(async (email) => {
    await sendPasswordResetEmail(auth, email);
  }, []);

  // Update user locally
  const updateUser = useCallback((updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
  }, []);

  const isAuthenticated = !!user;

  const hasRole = useCallback(
    (...roles) => {
      return roles.includes(role);
    },
    [role]
  );

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

  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }

  return context;
}

export default AuthContext;