const express = require('express');
const prisma = require('../lib/prisma');
const { verifyAdminToken } = require('./admin');

const router = express.Router();
router.use(verifyAdminToken);

router.get('/summary', async (req, res) => {
  const [pageViews, productViews, sessions, sources] = await Promise.all([
    prisma.visitorEvent.count(),
    prisma.visitorEvent.count({ where: { productSlug: { not: null } } }),
    prisma.visitorEvent.findMany({ distinct: ['sessionId'], where: { sessionId: { not: null } }, select: { sessionId: true } }).then((rows) => rows.length),
    prisma.visitorEvent.groupBy({ by: ['source'], _count: { _all: true }, orderBy: { _count: { source: 'desc' } }, take: 10 }),
  ]);
  res.json({
    pageViews,
    productViews,
    sessions,
    sources: sources.map((row) => ({ source: row.source || 'Unknown', count: row._count._all })),
  });
});

module.exports = router;
