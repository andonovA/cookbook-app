# Cookbook App

A cloud-based, mobile-friendly cookbook application where users can share cooking recipes with text, photos, and videos.

## Features

- 🔐 Authentication with email or Google OAuth
- 📝 Create and share recipes with text, photos, and videos
- 📱 Mobile-friendly responsive design
- ☁️ Powered by Supabase (free tier)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up Supabase:
   - Create a free account at [supabase.com](https://supabase.com)
   - Create a new project
   - Go to Settings > API and copy your project URL and anon key
   - Enable Google OAuth:
     - Go to Authentication > Providers
     - Enable Google provider
     - Add your Google OAuth credentials (Client ID and Client Secret)
     - Get these from [Google Cloud Console](https://console.cloud.google.com)
     - Add authorized redirect URI: `https://your-project-ref.supabase.co/auth/v1/callback`

3. Create a `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up the database:
   - Go to SQL Editor in Supabase
   - Run the SQL from `supabase-setup.sql` to create the recipes table

5. Set up Storage:
   - Go to Storage in Supabase dashboard
   - Click "New bucket"
   - Name it `recipe-media` and make it **Public** (toggle ON)
   - Click "Create bucket"
   - Then go to SQL Editor and run the SQL from `supabase-storage-setup.sql` to set up storage policies

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Deployment

This app can be deployed to Vercel (free tier) for cloud hosting:
1. Push your code to GitHub
2. Import the repository to Vercel
3. Add your environment variables
4. Deploy!

