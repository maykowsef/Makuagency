// Simple deployment test for Vercel
module.exports = async (req, res) => {
  // Test basic API response
  if (req.method === 'GET' && req.url === '/api/test') {
    res.status(200).json({ 
      message: 'Backend is working!',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
    return;
  }

  // Test database connection
  if (req.method === 'GET' && req.url === '/api/db-test') {
    try {
      const { Pool } = require('pg');
      const connectionString = process.env.DATABASE_URL;
      
      if (!connectionString) {
        return res.status(500).json({ error: 'DATABASE_URL not configured' });
      }

      const pool = new Pool({ connectionString });
      const client = await pool.connect();
      
      const result = await client.query('SELECT NOW() as current_time');
      await client.release();
      await pool.end();

      res.status(200).json({ 
        message: 'Database connected successfully!',
        time: result.rows[0].current_time
      });
    } catch (error) {
      res.status(500).json({ 
        error: 'Database connection failed',
        details: error.message 
      });
    }
    return;
  }

  // Default response
  res.status(404).json({ error: 'Endpoint not found' });
};
