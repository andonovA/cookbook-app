-- Note: Create the bucket 'recipe-media' in the Supabase UI first (Storage > Buckets > New Bucket)
-- Make sure it's set to Public access

-- Enable RLS on storage.objects (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Public recipe media is viewable by everyone" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload recipe media" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own recipe media" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own recipe media" ON storage.objects;

-- Policy: Anyone can view public recipe media
CREATE POLICY "Public recipe media is viewable by everyone"
ON storage.objects FOR SELECT
USING (bucket_id = 'recipe-media');

-- Policy: Authenticated users can upload recipe media
CREATE POLICY "Authenticated users can upload recipe media"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'recipe-media' 
  AND auth.role() = 'authenticated'
);

-- Policy: Users can update their own recipe media
CREATE POLICY "Users can update their own recipe media"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'recipe-media' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can delete their own recipe media
CREATE POLICY "Users can delete their own recipe media"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'recipe-media' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

