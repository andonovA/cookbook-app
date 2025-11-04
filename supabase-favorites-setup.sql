-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, recipe_id) -- Prevent duplicate favorites
);

-- Enable Row Level Security
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own favorites
CREATE POLICY "Users can view their own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can add their own favorites
CREATE POLICY "Users can add their own favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own favorites
CREATE POLICY "Users can delete their own favorites"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS favorites_user_id_idx ON favorites(user_id);
CREATE INDEX IF NOT EXISTS favorites_recipe_id_idx ON favorites(recipe_id);
CREATE INDEX IF NOT EXISTS favorites_created_at_idx ON favorites(created_at DESC);

