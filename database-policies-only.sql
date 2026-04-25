-- Database Policies Setup Only
-- Use this script if tables already exist and you just need to update policies

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE selling_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE minisites ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

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

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Database policies have been successfully updated!';
END $$;
