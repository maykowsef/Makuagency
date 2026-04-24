const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://snswadioooqitikqmxjl.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_jBwIe7SlVBjnnb0RoKrs3w_YcwjzFWD';
const supabase = createClient(supabaseUrl, supabaseKey);

// Error handler
const handleError = (res, error) => {
  console.error(error);
  res.status(500).json({ error: error.message || 'Internal Server Error' });
};

// Root endpoint
app.get('/', async (req, res) => {
  res.json({ 
    message: 'Backend API is running!',
    endpoints: [
      '/api/test',
      '/api/companies',
      '/api/contacts', 
      '/api/selling-points',
      '/api/activities',
      '/api/minisites',
      '/api/schedules',
      '/api/assignments',
      '/api/inventory'
    ],
    timestamp: new Date().toISOString(),
    supabaseConnected: !!supabase
  });
});

// Test endpoint
app.get('/api/test', async (req, res) => {
  res.json({ 
    message: 'Supabase API backend is working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Companies endpoints
app.get('/api/companies', async (req, res) => {
  try {
    console.log('📥 GET /api/companies request');
    const { data, error } = await supabase
      .from('companies')
      .select('*');
    
    if (error) {
      console.log('❌ Supabase GET error:', error);
      throw error;
    }
    
    console.log('✅ Companies retrieved:', data.length, 'items');
    res.json(data || []);
  } catch (error) { 
    console.log('❌ API GET error:', error);
    handleError(res, error); 
  }
});

app.post('/api/companies', async (req, res) => {
  try {
    console.log('📤 POST /api/companies request:', req.body);
    const { data, error } = await supabase
      .from('companies')
      .insert([req.body])
      .select();
    
    if (error) {
      console.log('❌ Supabase POST error:', error);
      throw error;
    }
    
    console.log('✅ Company created:', data[0]);
    res.json(data[0]);
  } catch (error) { 
    console.log('❌ API POST error:', error);
    handleError(res, error); 
  }
});

// Contacts endpoints
app.get('/api/contacts', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*');
    
    if (error) throw error;
    res.json(data || []);
  } catch (error) { handleError(res, error); }
});

app.post('/api/contacts', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .insert([req.body])
      .select();
    
    if (error) throw error;
    res.json(data[0]);
  } catch (error) { handleError(res, error); }
});

// Selling Points endpoints
app.get('/api/selling-points', async (req, res) => {
  try {
    console.log('📥 GET /api/selling-points request');
    const { data, error } = await supabase
      .from('selling_points')
      .select(`
        *,
        companies:company_id (
          id,
          name
        )
      `);
    
    if (error) {
      console.log('❌ Supabase GET error:', error);
      throw error;
    }
    
    // Transform data to include companyName for frontend compatibility
    const transformedData = data.map(item => ({
      ...item,
      companyName: item.companies?.name || 'Unknown Company',
      companyId: item.company_id
    }));
    
    console.log('✅ Selling points retrieved:', transformedData.length, 'items');
    res.json(transformedData || []);
  } catch (error) { 
    console.log('❌ API GET error:', error);
    handleError(res, error); 
  }
});

app.post('/api/selling-points', async (req, res) => {
  try {
    console.log('📤 POST /api/selling-points request:', req.body);
    
    const sellingPointData = {
      ...req.body,
      created_at: req.body.created_at || new Date().toISOString(),
      last_modified: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('selling_points')
      .insert([sellingPointData])
      .select(`
        *,
        companies:company_id (
          id,
          name
        )
      `);
    
    if (error) {
      console.log('❌ Supabase POST error:', error);
      throw error;
    }
    
    // Transform data to include companyName for frontend compatibility
    const transformedData = data.map(item => ({
      ...item,
      companyName: item.companies?.name || 'Unknown Company',
      companyId: item.company_id
    }));
    
    console.log('✅ Selling point created:', transformedData[0]);
    res.json(transformedData[0]);
  } catch (error) { 
    console.log('❌ API POST error:', error);
    handleError(res, error); 
  }
});

// Mock endpoints for other entities
app.get('/api/activities', async (req, res) => {
  res.json([]);
});

app.post('/api/activities', async (req, res) => {
  res.json({ success: true });
});

app.get('/api/minisites', async (req, res) => {
  res.json([]);
});

app.get('/api/schedules', async (req, res) => {
  res.json([]);
});

app.get('/api/assignments', async (req, res) => {
  res.json([]);
});

app.get('/api/inventory', async (req, res) => {
  res.json([]);
});

// Export for Vercel
module.exports = (req, res) => {
  console.log('📥 Backend request:', req.method, req.url);
  app(req, res);
};
