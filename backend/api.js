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
      '/api/selling-points/:id (GET/PUT/DELETE)',
      '/api/activities',
      '/api/minisites',
      '/api/minisites/:id (PUT/DELETE)',
      '/api/minisites/:id/publish',
      '/api/minisites/:id/inspect',
      '/api/public/minisites/:slug',
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
      companyId: item.company_id,
      // Map database column names back to frontend field names
      announcementProfiles: item.announcement_profiles,
      logoHistory: item.logo_history,
      socialMedia: item.social_media,
      address: item.address_data || {
        street: item.address,
        city: item.city,
        country: item.country,
        postalCode: item.postal_code
      },
      address_data: item.address_data
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
    
    // First try with full data mapping
    let sellingPointData = {
      name: req.body.name,
      company_id: req.body.companyId || req.body.company_id,
      business_type: req.body.businessType,
      industry: req.body.industry,
      siret: req.body.siret,
      address: req.body.address_data?.street || req.body.address,
      city: req.body.address_data?.city || req.body.city,
      country: req.body.address_data?.country || req.body.country,
      postal_code: req.body.address_data?.postalCode || req.body.postal_code,
      phones: req.body.phones || [],
      email: req.body.email,
      created_by: req.body.created_by,
      description: req.body.description,
      announcement_profiles: req.body.announcementProfiles || [],
      contacts: req.body.contacts || [],
      logo_history: req.body.logoHistory || [],
      notes: req.body.notes || [],
      social_media: req.body.socialMedia || [],
      priority: req.body.priority || 'Medium',
      status: req.body.status || 'Active',
      address_data: req.body.address || {},
      mobile: req.body.mobile,
      position: req.body.position,
      linkedin: req.body.linkedin,
      avatar: req.body.avatar,
      created_at: req.body.created_at || new Date().toISOString(),
      last_modified: new Date().toISOString()
    };
    
    console.log('🔍 Mapped selling point data:', sellingPointData);
    
    let { data, error } = await supabase
      .from('selling_points')
      .insert([sellingPointData])
      .select(`
        *,
        companies:company_id (
          id,
          name
        )
      `);
    
    // If error due to missing columns, try with basic data only
    if (error && (error.message && (error.message.includes('column') && error.message.includes('does not exist') || error.message.includes('schema cache')))) {
      console.log('⚠️ Column missing or schema cache issue, trying with basic data only...');
      console.log('❌ Error details:', error);
      
      const basicSellingPointData = {
        name: req.body.name,
        company_id: req.body.companyId || req.body.company_id,
        business_type: req.body.businessType,
        industry: req.body.industry,
        siret: req.body.siret,
        address: req.body.address_data?.street || req.body.address,
        city: req.body.address_data?.city || req.body.city,
        country: req.body.address_data?.country || req.body.country,
        postal_code: req.body.address_data?.postalCode || req.body.postal_code,
        phones: req.body.phones || [],
        email: req.body.email,
        created_by: req.body.created_by,
        description: req.body.description,
        created_at: req.body.created_at || new Date().toISOString(),
        last_modified: new Date().toISOString()
      };
      
      console.log('🔍 Basic selling point data:', basicSellingPointData);
      
      const result = await supabase
        .from('selling_points')
        .insert([basicSellingPointData])
        .select(`
          *,
          companies:company_id (
            id,
            name
          )
        `);
      
      data = result.data;
      error = result.error;
      
      // If still failing, try with minimal data
      if (error && (error.message && (error.message.includes('column') && error.message.includes('does not exist') || error.message.includes('schema cache')))) {
        console.log('⚠️ Still failing, trying with minimal data...');
        
        const minimalSellingPointData = {
          name: req.body.name,
          email: req.body.email,
          created_at: req.body.created_at || new Date().toISOString(),
          last_modified: new Date().toISOString()
        };
        
        console.log('🔍 Minimal selling point data:', minimalSellingPointData);
        
        const minimalResult = await supabase
          .from('selling_points')
          .insert([minimalSellingPointData])
          .select(`
            *,
            companies:company_id (
              id,
              name
            )
          `);
        
        data = minimalResult.data;
        error = minimalResult.error;
      }
    }
    
    if (error) {
      console.log('❌ Supabase POST error:', error);
      throw error;
    }
    
    // Transform data to include companyName for frontend compatibility
    const transformedData = data.map(item => ({
      ...item,
      companyName: item.companies?.name || 'Unknown Company',
      companyId: item.company_id,
      // Map database column names back to frontend field names
      announcementProfiles: item.announcement_profiles || req.body.announcementProfiles || [],
      logoHistory: item.logo_history || req.body.logoHistory || [],
      socialMedia: item.social_media || req.body.socialMedia || [],
      address: item.address_data || req.body.address || {
        street: item.address,
        city: item.city,
        country: item.country,
        postalCode: item.postal_code
      },
      address_data: item.address_data || req.body.address || {},
      contacts: item.contacts || req.body.contacts || [],
      notes: item.notes || req.body.notes || [],
      priority: item.priority || req.body.priority || 'Medium',
      status: item.status || req.body.status || 'Active',
      mobile: item.mobile || req.body.mobile,
      position: item.position || req.body.position,
      linkedin: item.linkedin || req.body.linkedin,
      avatar: item.avatar || req.body.avatar
    }));
    
    console.log('✅ Selling point created:', transformedData[0]);
    res.json(transformedData[0]);
  } catch (error) { 
    console.log('❌ API POST error:', error);
    handleError(res, error); 
  }
});

// Selling Points GET by ID endpoint
app.get('/api/selling-points/:id', async (req, res) => {
  try {
    console.log('📥 GET /api/selling-points/:id request:', req.params.id);
    
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('selling_points')
      .select(`
        *,
        companies:company_id (
          id,
          name
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.log('❌ Supabase GET by ID error:', error);
      throw error;
    }
    
    if (!data) {
      return res.status(404).json({ error: 'Selling point not found' });
    }
    
    // Transform data to include companyName for frontend compatibility
    const transformedData = {
      ...data,
      companyName: data.companies?.name || 'Unknown Company',
      companyId: data.company_id,
      // Map database column names back to frontend field names
      announcementProfiles: data.announcement_profiles,
      logoHistory: data.logo_history,
      socialMedia: data.social_media,
      address: data.address_data || {
        street: data.address,
        city: data.city,
        country: data.country,
        postalCode: data.postal_code
      },
      address_data: data.address_data
    };
    
    console.log('✅ Selling point retrieved by ID:', transformedData);
    res.json(transformedData);
  } catch (error) { 
    console.log('❌ API GET by ID error:', error);
    handleError(res, error); 
  }
});

// Selling Points PUT endpoint (Update)
app.put('/api/selling-points/:id', async (req, res) => {
  try {
    console.log('📝 PUT /api/selling-points/:id request:', req.params.id, req.body);
    
    const { id } = req.params;
    const updateData = {
      ...req.body,
      last_modified: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('selling_points')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        companies:company_id (
          id,
          name
        )
      `);
    
    if (error) {
      console.log('❌ Supabase PUT error:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Selling point not found' });
    }
    
    // Transform data to include companyName for frontend compatibility
    const transformedData = data.map(item => ({
      ...item,
      companyName: item.companies?.name || 'Unknown Company',
      companyId: item.company_id
    }));
    
    console.log('✅ Selling point updated:', transformedData[0]);
    res.json(transformedData[0]);
  } catch (error) { 
    console.log('❌ API PUT error:', error);
    handleError(res, error); 
  }
});

// Selling Points DELETE endpoint
app.delete('/api/selling-points/:id', async (req, res) => {
  try {
    console.log('🗑️ DELETE /api/selling-points/:id request:', req.params.id);
    
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('selling_points')
      .delete()
      .eq('id', id)
      .select();
    
    if (error) {
      console.log('❌ Supabase DELETE error:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Selling point not found' });
    }
    
    console.log('✅ Selling point deleted:', id);
    res.json({ success: true, deletedId: id });
  } catch (error) { 
    console.log('❌ API DELETE error:', error);
    handleError(res, error); 
  }
});

// Activities endpoints
app.get('/api/activities', async (req, res) => {
  try {
    console.log('📥 GET /api/activities request');
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.log('❌ Supabase GET error:', error);
      throw error;
    }
    
    console.log('✅ Activities retrieved:', data.length, 'items');
    res.json(data || []);
  } catch (error) { 
    console.log('❌ API GET error:', error);
    handleError(res, error); 
  }
});

app.post('/api/activities', async (req, res) => {
  try {
    console.log('📤 POST /api/activities request:', req.body);
    
    const activityData = {
      ...req.body,
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('activities')
      .insert([activityData])
      .select();
    
    if (error) {
      console.log('❌ Supabase POST error:', error);
      throw error;
    }
    
    console.log('✅ Activity created:', data[0]);
    res.json(data[0]);
  } catch (error) { 
    console.log('❌ API POST error:', error);
    handleError(res, error); 
  }
});

// Minisites endpoints - Complete implementation
app.get('/api/minisites', async (req, res) => {
  try {
    console.log('📥 GET /api/minisites request');
    const { data, error } = await supabase
      .from('minisites')
      .select(`
        *,
        selling_points:selling_point_id (
          id,
          name,
          companies:company_id (
            id,
            name
          )
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.log('❌ Supabase GET error:', error);
      throw error;
    }
    
    // Transform data for frontend compatibility
    const transformedData = data.map(item => ({
      ...item,
      sellingPointName: item.selling_points?.name || 'Unknown Selling Point',
      companyName: item.selling_points?.companies?.name || 'Unknown Company'
    }));
    
    console.log('✅ Minisites retrieved:', transformedData.length, 'items');
    res.json(transformedData || []);
  } catch (error) { 
    console.log('❌ API GET error:', error);
    handleError(res, error); 
  }
});

app.post('/api/minisites', async (req, res) => {
  try {
    console.log('📤 POST /api/minisites request:', req.body);
    
    const minisiteData = {
      ...req.body,
      created_at: new Date().toISOString(),
      last_modified: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('minisites')
      .insert([minisiteData])
      .select(`
        *,
        selling_points:selling_point_id (
          id,
          name,
          companies:company_id (
            id,
            name
          )
        )
      `);
    
    if (error) {
      console.log('❌ Supabase POST error:', error);
      throw error;
    }
    
    // Transform data for frontend compatibility
    const transformedData = data.map(item => ({
      ...item,
      sellingPointName: item.selling_points?.name || 'Unknown Selling Point',
      companyName: item.selling_points?.companies?.name || 'Unknown Company'
    }));
    
    console.log('✅ Minisite created:', transformedData[0]);
    res.json(transformedData[0]);
  } catch (error) { 
    console.log('❌ API POST error:', error);
    handleError(res, error); 
  }
});

app.put('/api/minisites/:id', async (req, res) => {
  try {
    console.log('📝 PUT /api/minisites/:id request:', req.params.id, req.body);
    
    const { id } = req.params;
    const updateData = {
      ...req.body,
      last_modified: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('minisites')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        selling_points:selling_point_id (
          id,
          name,
          companies:company_id (
            id,
            name
          )
        )
      `);
    
    if (error) {
      console.log('❌ Supabase PUT error:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Minisite not found' });
    }
    
    // Transform data for frontend compatibility
    const transformedData = data.map(item => ({
      ...item,
      sellingPointName: item.selling_points?.name || 'Unknown Selling Point',
      companyName: item.selling_points?.companies?.name || 'Unknown Company'
    }));
    
    console.log('✅ Minisite updated:', transformedData[0]);
    res.json(transformedData[0]);
  } catch (error) { 
    console.log('❌ API PUT error:', error);
    handleError(res, error); 
  }
});

app.delete('/api/minisites/:id', async (req, res) => {
  try {
    console.log('🗑️ DELETE /api/minisites/:id request:', req.params.id);
    
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('minisites')
      .delete()
      .eq('id', id)
      .select();
    
    if (error) {
      console.log('❌ Supabase DELETE error:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Minisite not found' });
    }
    
    console.log('✅ Minisite deleted:', id);
    res.json({ success: true, deletedId: id });
  } catch (error) { 
    console.log('❌ API DELETE error:', error);
    handleError(res, error); 
  }
});

// Minisite publish endpoint
app.post('/api/minisites/:id/publish', async (req, res) => {
  try {
    console.log('🚀 POST /api/minisites/:id/publish request:', req.params.id);
    
    const { id } = req.params;
    
    // Update minisite status to published
    const { data, error } = await supabase
      .from('minisites')
      .update({ 
        status: 'published',
        published_at: new Date().toISOString(),
        last_modified: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        selling_points:selling_point_id (
          id,
          name,
          companies:company_id (
            id,
            name
          )
        )
      `);
    
    if (error) {
      console.log('❌ Supabase PUBLISH error:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Minisite not found' });
    }
    
    // Transform data for frontend compatibility
    const transformedData = data.map(item => ({
      ...item,
      sellingPointName: item.selling_points?.name || 'Unknown Selling Point',
      companyName: item.selling_points?.companies?.name || 'Unknown Company'
    }));
    
    console.log('✅ Minisite published:', transformedData[0]);
    res.json(transformedData[0]);
  } catch (error) { 
    console.log('❌ API PUBLISH error:', error);
    handleError(res, error); 
  }
});

// Minisite inspection endpoint - Get published minisite for viewing
app.get('/api/minisites/:id/inspect', async (req, res) => {
  try {
    console.log('🔍 GET /api/minisites/:id/inspect request:', req.params.id);
    
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('minisites')
      .select(`
        *,
        selling_points:selling_point_id (
          id,
          name,
          business_type,
          industry,
          address,
          city,
          country,
          postal_code,
          phones,
          email,
          description,
          companies:company_id (
            id,
            name,
            website,
            phone,
            email
          )
        )
      `)
      .eq('id', id)
      .eq('status', 'published')
      .single();
    
    if (error) {
      console.log('❌ Supabase INSPECT error:', error);
      throw error;
    }
    
    if (!data) {
      return res.status(404).json({ error: 'Published minisite not found' });
    }
    
    // Transform data for frontend compatibility
    const transformedData = {
      ...data,
      sellingPointName: data.selling_points?.name || 'Unknown Selling Point',
      companyName: data.selling_points?.companies?.name || 'Unknown Company',
      companyWebsite: data.selling_points?.companies?.website || '',
      companyPhone: data.selling_points?.companies?.phone || '',
      companyEmail: data.selling_points?.companies?.email || ''
    };
    
    console.log('✅ Minisite inspection data:', transformedData);
    res.json(transformedData);
  } catch (error) { 
    console.log('❌ API INSPECT error:', error);
    handleError(res, error); 
  }
});

// Public minisite view endpoint (for external viewing)
app.get('/api/public/minisites/:slug', async (req, res) => {
  try {
    console.log('🌐 GET /api/public/minisites/:slug request:', req.params.slug);
    
    const { slug } = req.params;
    
    const { data, error } = await supabase
      .from('minisites')
      .select(`
        *,
        selling_points:selling_point_id (
          id,
          name,
          business_type,
          industry,
          address,
          city,
          country,
          postal_code,
          phones,
          email,
          description,
          companies:company_id (
            id,
            name,
            website,
            phone,
            email,
            description
          )
        )
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single();
    
    if (error) {
      console.log('❌ Supabase PUBLIC VIEW error:', error);
      throw error;
    }
    
    if (!data) {
      return res.status(404).json({ error: 'Published minisite not found' });
    }
    
    // Transform data for public viewing
    const transformedData = {
      ...data,
      sellingPointName: data.selling_points?.name || 'Unknown Selling Point',
      companyName: data.selling_points?.companies?.name || 'Unknown Company',
      companyWebsite: data.selling_points?.companies?.website || '',
      companyPhone: data.selling_points?.companies?.phone || '',
      companyEmail: data.selling_points?.companies?.email || '',
      companyDescription: data.selling_points?.companies?.description || ''
    };
    
    console.log('✅ Public minisite view:', transformedData);
    res.json(transformedData);
  } catch (error) { 
    console.log('❌ API PUBLIC VIEW error:', error);
    handleError(res, error); 
  }
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
