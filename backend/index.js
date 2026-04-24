// Main entry point for Vercel deployment
const api = require('./api/supabase-api');

module.exports = (req, res) => {
  console.log('📥 Backend request:', req.method, req.url);
  return api(req, res);
};
