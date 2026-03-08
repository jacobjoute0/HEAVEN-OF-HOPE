import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import api from './api';

/**
 * Sign in via Firebase Auth.  The backend receives the Firebase ID token on
 * subsequent API calls via the Axios interceptor in api.js.
 */
export async function loginWithFirebase(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

/**
 * Sign out from Firebase Auth and notify the backend so it can revoke
 * refresh tokens server-side.
 */
export async function logout() {
  try {
    await api.post('/auth/logout');
  } catch {
    // Ignore backend errors during logout.
  }
  await signOut(auth);
}

/** Returns the currently signed-in Firebase user, or null. */
export function getCurrentUser() {
  return auth.currentUser || null;
}

/** Returns the current user's role from the Firebase custom claims. */
export async function getUserRole() {
  const user = auth.currentUser;
  if (!user) return null;
  const idTokenResult = await user.getIdTokenResult();
  return idTokenResult.claims.role || null;
}

/** Returns a fresh Firebase ID token for the current user. */
export async function getToken() {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
}

/** True if a Firebase user is currently signed in. */
export function isAuthenticated() {
  return Boolean(auth.currentUser);
}

/** Send a password-reset email via Firebase Auth. */
export async function forgotPassword(email) {
  await sendPasswordResetEmail(auth, email);
}

/**
 * Change the current user's password.
 * Re-authenticates first so Firebase does not reject the request.
 */
export async function changePassword(currentPassword, newPassword) {
  const user = auth.currentUser;
  if (!user || !user.email) throw new Error('Not authenticated');
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, newPassword);
}

