const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase client
const supabaseUrl = 'https://snswadioooqitikqmxjl.supabase.co';
const supabaseKey = 'sb_publishable_jBwIe7SlVBjnnb0RoKrs3w_YcwjzFWD';
const supabase = createClient(supabaseUrl, supabaseKey);

// Error handler
const handleError = (res, error) => {
  console.error(error);
  res.status(500).json({ error: error.message || 'Internal Server Error' });
};

// ─── COMPANIES ──────────────────────────────────────────────────────

app.get('/companies', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*');
    
    if (error) throw error;
    res.json(data);
  } catch (error) { handleError(res, error); }
});

app.post('/companies', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('companies')
      .insert([req.body])
      .select();
    
    if (error) throw error;
    res.json(data[0]);
  } catch (error) { handleError(res, error); }
});

app.put('/companies/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { id: _, ...updateData } = req.body;
    
    const { data, error } = await supabase
      .from('companies')
      .update(updateData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    res.json(data[0]);
  } catch (error) { handleError(res, error); }
});

app.delete('/companies/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', req.params.id);
    
    if (error) throw error;
    res.sendStatus(204);
  } catch (error) { handleError(res, error); }
});

// ─── CONTACTS ───────────────────────────────────────────────────────

app.get('/contacts', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*');
    
    if (error) throw error;
    res.json(data);
  } catch (error) { handleError(res, error); }
});

app.post('/contacts', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .insert([req.body])
      .select();
    
    if (error) throw error;
    res.json(data[0]);
  } catch (error) { handleError(res, error); }
});

app.put('/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { id: _, ...updateData } = req.body;
    
    const { data, error } = await supabase
      .from('contacts')
      .update(updateData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    res.json(data[0]);
  } catch (error) { handleError(res, error); }
});

app.delete('/contacts/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', req.params.id);
    
    if (error) throw error;
    res.sendStatus(204);
  } catch (error) { handleError(res, error); }
});

// ─── SELLING POINTS ───────────────────────────────────────────────────

app.get('/selling-points', async (req, res) => {
  try {
    console.log('📥 GET /selling-points request');
    const { data, error } = await supabase
      .from('selling_points')
      .select('*');
    
    if (error) {
      console.log('❌ Supabase GET error:', error);
      throw error;
    }
    
    console.log('✅ Selling points retrieved:', data.length, 'items');
    res.json(data || []);
  } catch (error) { 
    console.log('❌ API GET error:', error);
    handleError(res, error); 
  }
});

app.post('/selling-points', async (req, res) => {
  try {
    console.log('📤 POST /selling-points request:', req.body);
    
    // Ensure required fields
    const sellingPointData = {
      ...req.body,
      created_at: req.body.created_at || new Date().toISOString(),
      last_modified: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('selling_points')
      .insert([sellingPointData])
      .select();
    
    if (error) {
      console.log('❌ Supabase POST error:', error);
      throw error;
    }
    
    console.log('✅ Selling point created:', data[0]);
    res.json(data[0]);
  } catch (error) { 
    console.log('❌ API POST error:', error);
    handleError(res, error); 
  }
});

app.put('/selling-points/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { id: _, ...updateData } = req.body;
    
    updateData.last_modified = new Date().toISOString();
    
    console.log('📝 PUT /selling-points/', id, 'request:', updateData);
    
    const { data, error } = await supabase
      .from('selling_points')
      .update(updateData)
      .eq('id', id)
      .select();
    
    if (error) {
      console.log('❌ Supabase PUT error:', error);
      throw error;
    }
    
    console.log('✅ Selling point updated:', data[0]);
    res.json(data[0]);
  } catch (error) { 
    console.log('❌ API PUT error:', error);
    handleError(res, error); 
  }
});

app.delete('/selling-points/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🗑️ DELETE /selling-points/', id);
    
    const { error } = await supabase
      .from('selling_points')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.log('❌ Supabase DELETE error:', error);
      throw error;
    }
    
    console.log('✅ Selling point deleted');
    res.sendStatus(204);
  } catch (error) { 
    console.log('❌ API DELETE error:', error);
    handleError(res, error); 
  }
});

// Test endpoint
app.get('/test', async (req, res) => {
  res.json({ 
    message: 'Supabase API backend is working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Activities endpoint (mock for now)
app.get('/activities', async (req, res) => {
  res.json([]);
});

app.post('/activities', async (req, res) => {
  res.json({ success: true });
});

// Minisites endpoint (mock for now)
app.get('/minisites', async (req, res) => {
  res.json([]);
});

// Schedules endpoint (mock for now)
app.get('/schedules', async (req, res) => {
  res.json([]);
});

// Assignments endpoint (mock for now)
app.get('/assignments', async (req, res) => {
  res.json([]);
});

// Inventory endpoint (mock for now)
app.get('/inventory', async (req, res) => {
  res.json([]);
});

// Root endpoint for debugging
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
    timestamp: new Date().toISOString()
  });
});

// Export for Vercel
module.exports = (req, res) => {
  console.log('📥 Request:', req.method, req.url);
  app(req, res);
};
