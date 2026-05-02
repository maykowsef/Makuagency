-- CRM Database Schema Setup
-- Run this in Supabase SQL Editor

-- Create Companies table
CREATE TABLE IF NOT EXISTS companies (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  industry TEXT,
  siret TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  postal_code TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  linkedin TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  last_modified TIMESTAMP DEFAULT NOW()
);

-- Create Contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  mobile TEXT,
  position TEXT,
  company_id INTEGER REFERENCES companies(id),
  linkedin TEXT,
  avatar TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  last_modified TIMESTAMP DEFAULT NOW()
);

-- Create Selling Points table
CREATE TABLE IF NOT EXISTS selling_points (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  company_id INTEGER REFERENCES companies(id),
  business_type TEXT,
  industry TEXT,
  siret TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  postal_code TEXT,
  phones JSONB DEFAULT '[]',
  email TEXT,
  created_by JSONB,
  description TEXT,
  -- Additional columns needed by frontend
  announcement_profiles JSONB DEFAULT '[]',
  contacts JSONB DEFAULT '[]',
  logo_history JSONB DEFAULT '[]',
  notes JSONB DEFAULT '[]',
  social_media JSONB DEFAULT '[]',
  priority TEXT DEFAULT 'Medium',
  status TEXT DEFAULT 'Active',
  -- Address fields as JSONB for structured data
  address_data JSONB DEFAULT '{}',
  -- Additional contact info
  mobile TEXT,
  position TEXT,
  linkedin TEXT,
  avatar TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  last_modified TIMESTAMP DEFAULT NOW()
);

-- Create Minisites table
CREATE TABLE IF NOT EXISTS minisites (
  id SERIAL PRIMARY KEY,
  selling_point_id INTEGER REFERENCES selling_points(id),
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  content TEXT,
  status TEXT DEFAULT 'draft',
  template TEXT DEFAULT 'default',
  metadata JSONB DEFAULT '{}',
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  last_modified TIMESTAMP DEFAULT NOW()
);

-- Create Activities table (for logging)
CREATE TABLE IF NOT EXISTS activities (
  id SERIAL PRIMARY KEY,
  type TEXT,
  description TEXT,
  entity_type TEXT,
  entity_id INTEGER,
  user_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create Assignments table
CREATE TABLE IF NOT EXISTS assignments (
  id SERIAL PRIMARY KEY,
  contact_id INTEGER REFERENCES contacts(id),
  selling_point_id INTEGER REFERENCES selling_points(id),
  role TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE selling_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE minisites ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for security)
-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Enable insert for all" ON companies;
DROP POLICY IF EXISTS "Enable select for all" ON companies;
DROP POLICY IF EXISTS "Enable update for all" ON companies;
DROP POLICY IF EXISTS "Enable delete for all" ON companies;

CREATE POLICY "Enable insert for all" ON companies FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable select for all" ON companies FOR SELECT USING (true);
CREATE POLICY "Enable update for all" ON companies FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all" ON companies FOR DELETE USING (true);

DROP POLICY IF EXISTS "Enable insert for all" ON contacts;
DROP POLICY IF EXISTS "Enable select for all" ON contacts;
DROP POLICY IF EXISTS "Enable update for all" ON contacts;
DROP POLICY IF EXISTS "Enable delete for all" ON contacts;

CREATE POLICY "Enable insert for all" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable select for all" ON contacts FOR SELECT USING (true);
CREATE POLICY "Enable update for all" ON contacts FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all" ON contacts FOR DELETE USING (true);

DROP POLICY IF EXISTS "Enable insert for all" ON selling_points;
DROP POLICY IF EXISTS "Enable select for all" ON selling_points;
DROP POLICY IF EXISTS "Enable update for all" ON selling_points;
DROP POLICY IF EXISTS "Enable delete for all" ON selling_points;

CREATE POLICY "Enable insert for all" ON selling_points FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable select for all" ON selling_points FOR SELECT USING (true);
CREATE POLICY "Enable update for all" ON selling_points FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all" ON selling_points FOR DELETE USING (true);

DROP POLICY IF EXISTS "Enable insert for all" ON minisites;
DROP POLICY IF EXISTS "Enable select for all" ON minisites;
DROP POLICY IF EXISTS "Enable update for all" ON minisites;
DROP POLICY IF EXISTS "Enable delete for all" ON minisites;

CREATE POLICY "Enable insert for all" ON minisites FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable select for all" ON minisites FOR SELECT USING (true);
CREATE POLICY "Enable update for all" ON minisites FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all" ON minisites FOR DELETE USING (true);

DROP POLICY IF EXISTS "Enable insert for all" ON activities;
DROP POLICY IF EXISTS "Enable select for all" ON activities;

CREATE POLICY "Enable insert for all" ON activities FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable select for all" ON activities FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable insert for all" ON assignments;
DROP POLICY IF EXISTS "Enable select for all" ON assignments;
DROP POLICY IF EXISTS "Enable update for all" ON assignments;
DROP POLICY IF EXISTS "Enable delete for all" ON assignments;

CREATE POLICY "Enable insert for all" ON assignments FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable select for all" ON assignments FOR SELECT USING (true);
CREATE POLICY "Enable update for all" ON assignments FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all" ON assignments FOR DELETE USING (true);

-- Insert sample data (optional)
INSERT INTO companies (name, industry, siret, address, city, country, postal_code, phone, email, website, description) 
VALUES 
  ('Tech Company A', 'Technology', '12345678901234', '123 Tech Street', 'Paris', 'France', '75001', '+33123456789', 'contact@techa.com', 'https://techa.com', 'A technology company specializing in software development'),
  ('Marketing Agency B', 'Marketing', '98765432109876', '456 Market Ave', 'Lyon', 'France', '69000', '+33987654321', 'info@marketingb.com', 'https://marketingb.com', 'Full-service marketing agency')
ON CONFLICT DO NOTHING;

INSERT INTO selling_points (name, company_id, business_type, industry, siret, address, city, country, postal_code, phones, email, created_by, description)
VALUES 
  ('Tech Solutions Hub', 1, 'B2B Services', 'Technology', '12345678901234', '123 Tech Street', 'Paris', 'France', '75001', '[{"id": 1, "number": "+33123456789", "type": "Work"}]', 'contact@techa.com', '{"name": "Admin User", "avatar": "https://ui-avatars.com/api/?name=Admin+User"}', 'Main technology solutions center'),
  ('Digital Marketing Center', 2, 'Marketing Services', 'Marketing', '98765432109876', '456 Market Ave', 'Lyon', 'France', '69000', '[{"id": 1, "number": "+33987654321", "type": "Work"}]', 'info@marketingb.com', '{"name": "Marketing Manager", "avatar": "https://ui-avatars.com/api/?name=Marketing+Manager"}', 'Digital marketing services center')
ON CONFLICT DO NOTHING;
