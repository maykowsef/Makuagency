-- IMMEDIATE FIX: Add missing columns to selling_points table
-- Copy and paste this entire script into Supabase SQL Editor and run it

-- First, let's check what columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'selling_points' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Add missing columns one by one with IF NOT EXISTS
ALTER TABLE selling_points ADD COLUMN IF NOT EXISTS announcement_profiles JSONB DEFAULT '[]';
ALTER TABLE selling_points ADD COLUMN IF NOT EXISTS contacts JSONB DEFAULT '[]';
ALTER TABLE selling_points ADD COLUMN IF NOT EXISTS logo_history JSONB DEFAULT '[]';
ALTER TABLE selling_points ADD COLUMN IF NOT EXISTS notes JSONB DEFAULT '[]';
ALTER TABLE selling_points ADD COLUMN IF NOT EXISTS social_media JSONB DEFAULT '[]';
ALTER TABLE selling_points ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'Medium';
ALTER TABLE selling_points ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Active';
ALTER TABLE selling_points ADD COLUMN IF NOT EXISTS address_data JSONB DEFAULT '{}';
ALTER TABLE selling_points ADD COLUMN IF NOT EXISTS mobile TEXT;
ALTER TABLE selling_points ADD COLUMN IF NOT EXISTS position TEXT;
ALTER TABLE selling_points ADD COLUMN IF NOT EXISTS linkedin TEXT;
ALTER TABLE selling_points ADD COLUMN IF NOT EXISTS avatar TEXT;

-- Verify the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'selling_points' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ SUCCESS: All missing columns have been added to selling_points table!';
    RAISE NOTICE 'Now you can test selling point creation again.';
END $$;
