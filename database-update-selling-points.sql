-- Update selling_points table to add missing columns
-- Run this script to add the missing columns without recreating the table

-- Add missing columns for frontend compatibility
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

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Selling points table has been successfully updated with missing columns!';
END $$;
