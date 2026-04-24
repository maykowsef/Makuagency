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
    const { data, error } = await supabase
      .from('selling_points')
      .select('*');
    
    if (error) throw error;
    res.json(data);
  } catch (error) { handleError(res, error); }
});

app.post('/selling-points', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('selling_points')
      .insert([req.body])
      .select();
    
    if (error) throw error;
    res.json(data[0]);
  } catch (error) { handleError(res, error); }
});

app.put('/selling-points/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { id: _, ...updateData } = req.body;
    
    const { data, error } = await supabase
      .from('selling_points')
      .update(updateData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    res.json(data[0]);
  } catch (error) { handleError(res, error); }
});

app.delete('/selling-points/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('selling_points')
      .delete()
      .eq('id', req.params.id);
    
    if (error) throw error;
    res.sendStatus(204);
  } catch (error) { handleError(res, error); }
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

// Export for Vercel
module.exports = (req, res) => {
  app(req, res);
};
