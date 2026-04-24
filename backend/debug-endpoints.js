// Test script to debug backend endpoints
const { createClient } = require('@supabase/supabase-js');

// Test Supabase connection
const supabaseUrl = 'https://snswadioooqitikqmxjl.supabase.co';
const supabaseKey = 'sb_publishable_jBwIe7SlVBjnnb0RoKrs3w_YcwjzFWD';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseConnection() {
  console.log('🧪 Testing Supabase connection...');
  
  try {
    // Test if we can read from the database
    const { data, error } = await supabase
      .from('selling_points')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('❌ Supabase error:', error);
      return { success: false, error };
    }
    
    console.log('✅ Supabase connected successfully!');
    console.log('Data:', data);
    
    // Test inserting a selling point
    const testPoint = {
      name: 'Test Selling Point',
      company_id: 1,
      business_type: 'Test',
      industry: 'test',
      siret: '123456789',
      address: 'Test Address',
      city: 'Test City',
      country: 'Test Country',
      postal_code: '12345',
      phones: [{ id: 1, number: '+1234567890', type: 'Work' }],
      email: 'test@example.com',
      created_by: { name: 'Test User', avatar: 'https://ui-avatars.com/api/?name=Test+User' },
      description: 'Test description',
      created_at: new Date().toISOString(),
      last_modified: new Date().toISOString()
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('selling_points')
      .insert([testPoint])
      .select();
    
    if (insertError) {
      console.log('❌ Insert error:', insertError);
      return { success: false, error: insertError };
    }
    
    console.log('✅ Test selling point created:', insertData);
    return { success: true, data: insertData };
    
  } catch (error) {
    console.log('❌ Connection failed:', error);
    return { success: false, error };
  }
}

testSupabaseConnection();
