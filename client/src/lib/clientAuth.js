// Client-side authentication utility
// WARNING: This is NOT secure for production - passwords should NEVER be checked client-side
// This is a temporary workaround until backend API is properly configured

const ADMIN_PASSWORD = 'jafashions2026';

function generateToken() {
  const exp = Date.now() + 1000 * 60 * 60 * 24 * 7; // 7 days
  const payload = `admin.${exp}`;
  return btoa(payload); // Simple base64 encoding
}

export function verifyToken(token) {
  if (!token) return false;
  try {
    const decoded = atob(token);
    const [role, exp] = decoded.split('.');
    if (role !== 'admin') return false;
    if (Number(exp) < Date.now()) return false;
    return true;
  } catch {
    return false;
  }
}

export function checkPassword(password) {
  return password === ADMIN_PASSWORD;
}

export function login(password) {
  if (!checkPassword(password)) {
    throw new Error('Invalid password');
  }
  const token = generateToken();
  localStorage.setItem('jf_admin_token', token);
  return { ok: true, token };
}

export function logout() {
  localStorage.removeItem('jf_admin_token');
}

export function isAuthenticated() {
  const token = localStorage.getItem('jf_admin_token');
  return verifyToken(token);
}
