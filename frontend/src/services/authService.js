import api from './api';

export async function loginWithFirebase(email, password, role = 'student') {
  const response = await api.post('/auth/login', { email, password, role });
  const { token, user } = response.data;
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('role', user.role || role);
  return { token, user };
}

export async function logout() {
  try {
    await api.post('/auth/logout');
  } catch {
    // ignore
  }
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('role');
}

export function getCurrentUser() {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
}

export function getUserRole() {
  return localStorage.getItem('role') || null;
}

export function getToken() {
  return localStorage.getItem('token') || null;
}

export function isAuthenticated() {
  return Boolean(getToken() && getCurrentUser());
}

export async function refreshToken() {
  try {
    const response = await api.post('/auth/refresh');
    const { token } = response.data;
    localStorage.setItem('token', token);
    return token;
  } catch {
    return null;
  }
}

export async function forgotPassword(email) {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
}

export async function resetPassword(token, password) {
  const response = await api.post('/auth/reset-password', { token, password });
  return response.data;
}

export async function changePassword(currentPassword, newPassword) {
  const response = await api.post('/auth/change-password', { currentPassword, newPassword });
  return response.data;
}
