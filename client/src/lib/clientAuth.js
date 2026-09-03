import { api } from './api.js';

export async function login(email, password) {
  const response = await api.post('/auth/login', { email, password });
  if (!response.data?.token) throw new Error('Login succeeded but no session token was returned');
  localStorage.setItem('jf_admin_token', response.data.token);
  return response.data;
}

export function logout() {
  localStorage.removeItem('jf_admin_token');
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem('jf_admin_token'));
}

export function verifyToken(token) {
  return Boolean(token);
}
