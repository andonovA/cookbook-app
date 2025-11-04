# Setting Up Relationship Between Recipes and User Profiles

## Problem
Supabase shows an error: "Searched for a foreign key relationship between 'recipes' and 'user_profiles' in the schema 'public', but no matches were found."

This happens because Supabase's PostgREST API needs explicit foreign key relationships to automatically join tables.

## Solution

### Option 1: Add Foreign Key Relationship (Recommended)

Run the SQL from `supabase-relationship-fix.sql` in your Supabase SQL Editor:

1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste the contents of `supabase-relationship-fix.sql`
3. Click "Run" or press Ctrl+Enter

This will:
- Create user profiles for any existing users that don't have one
- Add a foreign key constraint from `recipes.user_id` to `user_profiles.id`
- Allow Supabase to automatically join these tables

### Option 2: Use Supabase Dashboard (Alternative)

1. Go to Supabase Dashboard → Database → Tables
2. Click on the `recipes` table
3. Go to "Relationships" tab
4. Click "Add Relationship"
5. Configure:
   - **Name**: `user_profiles`
   - **Type**: One-to-one or One-to-many
   - **Source Table**: `recipes`
   - **Source Column**: `user_id`
   - **Target Table**: `user_profiles`
   - **Target Column**: `id`
6. Click "Save"

## How It Works

Both `recipes.user_id` and `user_profiles.id` reference `auth.users(id)`. 

The foreign key from `recipes.user_id` to `user_profiles.id` creates a direct relationship that Supabase can use for automatic joins.

## After Adding the Relationship

Once the relationship is set up:

1. The error message will disappear
2. You can use Supabase's automatic join syntax:
   ```sql
   SELECT *, user_profiles(*) FROM recipes
   ```
3. The app will be able to join recipes and user profiles automatically

## Troubleshooting

**If the foreign key constraint fails:**
- Make sure all existing recipes have corresponding user profiles
- The SQL script handles this automatically by creating missing profiles

**If you still see errors:**
- Check that both tables exist
- Verify that `user_profiles.id` is the primary key
- Make sure RLS policies allow reading both tables

## Notes

- The relationship uses `DEFERRABLE INITIALLY DEFERRED` which means the constraint is checked at transaction end
- This allows creating recipes even if profiles don't exist yet (they'll be created by the trigger)
- The foreign key uses `ON DELETE CASCADE` so deleting a user profile will delete their recipes

