const crypto = require('crypto');
const prisma = require('../../server/src/lib/prisma');

function secret() { return process.env.ADMIN_SESSION_SECRET || 'dev-only-change-me'; }
function authorized(req) {
  const auth = req.headers?.authorization || '';
  const headerToken = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  const cookieToken = (req.headers?.cookie || '').match(/(?:^|;\s*)jf_admin_token=([^;]+)/)?.[1] || '';
  const token = headerToken || cookieToken;
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3 || parts[0] !== 'admin') return false;
  const payload = `${parts[0]}.${parts[1]}`;
  const expected = crypto.createHmac('sha256', secret()).update(payload).digest('hex');
  return parts[2] === expected && Number(parts[1]) >= Date.now();
}

module.exports = async (req, res) => {
  if (!authorized(req)) return res.status(401).json({ message: 'Authentication required' });
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });
  try {
    const [pageViews, productViews, sessions, sources] = await Promise.all([
      prisma.visitorEvent.count(),
      prisma.visitorEvent.count({ where: { productSlug: { not: null } } }),
      prisma.visitorEvent.findMany({ distinct: ['sessionId'], where: { sessionId: { not: null } }, select: { sessionId: true } }).then((rows) => rows.length),
      prisma.visitorEvent.groupBy({ by: ['source'], _count: { _all: true }, orderBy: { _count: { source: 'desc' } }, take: 10 }),
    ]);
    return res.status(200).json({ pageViews, productViews, sessions, sources: sources.map((row) => ({ source: row.source || 'Unknown', count: row._count._all })) });
  } catch (error) {
    console.error('Analytics error:', error);
    return res.status(500).json({ message: 'Could not load analytics' });
  }
};
