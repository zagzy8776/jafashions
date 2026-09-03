const router = require('../server/src/routes/store');

module.exports = (req, res) => {
  const value = req.query?.route;
  const parts = Array.isArray(value)
    ? value
    : String(value || '').split('/').filter(Boolean);
  const currentQuery = String(req.url || '').includes('?')
    ? String(req.url).slice(String(req.url).indexOf('?'))
    : '';
  req.url = `/${parts.join('/')}${currentQuery === '?' ? '' : currentQuery}`;

  return router(req, res, (error) => {
    if (error) {
      console.error('Store API error:', error);
      if (!res.headersSent) res.status(error.status || 500).json({ message: error.message || 'Internal Server Error' });
      return;
    }
    if (!res.headersSent) res.status(404).json({ message: 'Store route not found' });
  });
};
