import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../config/firebase";
import api from "../services/api";

const AuthContext = createContext(null);

async function resolveAuthenticatedUser(firebaseUser) {
  const tokenResult = await firebaseUser.getIdTokenResult(true);
  let serverUser = null;

  if (!tokenResult.claims.role) {
    try {
      const idToken = await firebaseUser.getIdToken();
      const response = await api.post("/auth/login", { idToken });
      serverUser = response.data?.user || null;
    } catch (error) {
      console.error("Error resolving user profile from backend:", error);
    }
  }

  const role = tokenResult.claims.role || serverUser?.role || null;
  const user = {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName || serverUser?.name || "",
    name: serverUser?.name || firebaseUser.displayName || "",
    photoURL: firebaseUser.photoURL || null,
  };

  return { role, user };
}

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
          const authenticatedUser = await resolveAuthenticatedUser(firebaseUser);

          setUser(authenticatedUser.user);
          setRole(authenticatedUser.role);
        } catch (err) {
          console.error("Error reading role:", err);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || "",
            name: firebaseUser.displayName || "",
            photoURL: firebaseUser.photoURL || null,
          });
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
      const authenticatedUser = await resolveAuthenticatedUser(credential.user);
      const userRole = authenticatedUser.role;

      // Reject login if the account role doesn't match this portal's expected role
      if (expectedRole && userRole !== expectedRole) {
        await signOut(auth);
        const label = expectedRole.charAt(0).toUpperCase() + expectedRole.slice(1);
        const message = `This is not a ${label} account. Please use the correct login portal.`;
        setError(message);
        return { success: false, error: message };
      }

      setUser(authenticatedUser.user);
      setRole(userRole);

      return {
        success: true,
        user: authenticatedUser.user,
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