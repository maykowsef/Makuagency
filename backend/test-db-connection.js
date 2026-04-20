const { Pool } = require('pg');

const connectionString = "postgresql://postgres:M123akrem456*@db.snswadioooqitikqmxjl.supabase.co:5432/postgres";

async function testConnection() {
  console.log('Testing database connection...');
  console.log('Connection string:', connectionString);
  
  const pool = new Pool({ connectionString });
  
  try {
    const client = await pool.connect();
    console.log('✅ Database connected successfully!');
    
    const result = await client.query('SELECT NOW()');
    console.log('✅ Query executed successfully:', result.rows[0]);
    
    await client.release();
    await pool.end();
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Full error:', error);
  }
}

testConnection();
