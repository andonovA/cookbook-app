-- Add relationship between recipes and user_profiles
-- This SQL file creates a foreign key relationship so Supabase can automatically join tables

-- First, ensure all existing recipes have corresponding user profiles
-- (This creates profiles for any users that don't have one yet)
INSERT INTO user_profiles (id, username, full_name)
SELECT 
  u.id,
  COALESCE(u.raw_user_meta_data->>'username', 'user_' || substr(u.id::text, 1, 8)),
  COALESCE(u.raw_user_meta_data->>'full_name', NULL)
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM user_profiles p WHERE p.id = u.id
)
ON CONFLICT (id) DO NOTHING;

-- Add foreign key relationship from recipes.user_id to user_profiles.id
-- This tells Supabase that recipes.user_id can be joined with user_profiles.id
DO $$
BEGIN
  -- Drop constraint if it exists
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'recipes_user_profiles_fk'
  ) THEN
    ALTER TABLE recipes DROP CONSTRAINT recipes_user_profiles_fk;
  END IF;
  
  -- Add the foreign key constraint
  -- DEFERRABLE INITIALLY DEFERRED allows the constraint to be checked at transaction end
  -- This is helpful when creating recipes before profiles exist
  ALTER TABLE recipes
  ADD CONSTRAINT recipes_user_profiles_fk
  FOREIGN KEY (user_id) 
  REFERENCES user_profiles(id) 
  ON DELETE CASCADE
  DEFERRABLE INITIALLY DEFERRED;
  
  RAISE NOTICE 'Foreign key relationship created successfully';
EXCEPTION
  WHEN others THEN
    RAISE NOTICE 'Could not create foreign key: %', SQLERRM;
    -- If constraint creation fails, continue anyway
    -- The app will still work, just without automatic joins
END $$;

-- Verify the relationship was created
SELECT 
  tc.constraint_name, 
  tc.table_name, 
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name = 'recipes'
  AND ccu.table_name = 'user_profiles';

