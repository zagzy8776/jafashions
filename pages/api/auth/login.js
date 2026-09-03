const crypto = require('crypto');

function secret() {
  return process.env.ADMIN_SESSION_SECRET || 'dev-only-change-me';
}

function signAdminToken() {
  const exp = Date.now() + 1000 * 60 * 60 * 24 * 7;
  const payload = `admin.${exp}`;
  const sig = crypto.createHmac('sha256', secret()).update(payload).digest('hex');
  return `${payload}.${sig}`;
}

function checkPassword(input) {
  const expected = process.env.ADMIN_PASSWORD || 'jafashions2026';
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  try {
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export default function handler(req, res) {
  console.log('Auth login called:', req.method);
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { password } = req.body || {};

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    if (!checkPassword(String(password).trim())) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = signAdminToken();
    const oneWeek = 60 * 60 * 24 * 7;

    // Set cookie header
    res.setHeader(
      'Set-Cookie',
      `jf_admin_token=${token}; Path=/; Max-Age=${oneWeek}; HttpOnly; SameSite=Lax${
        process.env.NODE_ENV === 'production' ? '; Secure' : ''
      }`
    );

    return res.status(200).json({ ok: true, token });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      message: 'Internal server error'
    });
  }
}
