-- SIMPLE DATABASE FIX - Copy and paste this into Supabase SQL Editor
-- This will add the missing address_data column and others

-- Add the most critical missing columns first
ALTER TABLE selling_points ADD COLUMN IF NOT EXISTS address_data JSONB DEFAULT '{}';
ALTER TABLE selling_points ADD COLUMN IF NOT EXISTS announcement_profiles JSONB DEFAULT '[]';
ALTER TABLE selling_points ADD COLUMN IF NOT EXISTS logo_history JSONB DEFAULT '[]';
ALTER TABLE selling_points ADD COLUMN IF NOT EXISTS social_media JSONB DEFAULT '[]';
ALTER TABLE selling_points ADD COLUMN IF NOT EXISTS contacts JSONB DEFAULT '[]';
ALTER TABLE selling_points ADD COLUMN IF NOT EXISTS notes JSONB DEFAULT '[]';
ALTER TABLE selling_points ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'Medium';
ALTER TABLE selling_points ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Active';
ALTER TABLE selling_points ADD COLUMN IF NOT EXISTS mobile TEXT;
ALTER TABLE selling_points ADD COLUMN IF NOT EXISTS position TEXT;
ALTER TABLE selling_points ADD COLUMN IF NOT EXISTS linkedin TEXT;
ALTER TABLE selling_points ADD COLUMN IF NOT EXISTS avatar TEXT;

-- Check if columns were added successfully
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'selling_points' 
AND table_schema = 'public'
AND column_name IN ('address_data', 'announcement_profiles', 'logo_history', 'social_media', 'contacts', 'notes', 'priority', 'status', 'mobile', 'position', 'linkedin', 'avatar')
ORDER BY column_name;

-- Success message
SELECT '✅ SUCCESS: Database columns added! Now test selling point creation.' as result;
