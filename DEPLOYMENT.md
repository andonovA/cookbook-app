# Deploy Cookbook App to Cloud

This guide will help you deploy your app to Vercel (free tier) so you can access it from your phone.

## Prerequisites

1. **GitHub account** (free) - https://github.com
2. **Vercel account** (free) - https://vercel.com
3. **Supabase project** already set up with:
   - Database tables created
   - Storage bucket created
   - Environment variables ready

## Step 1: Initialize Git Repository

Run these commands in your terminal:

```bash
git init
git add .
git commit -m "Initial commit: Cookbook app"
```

## Step 2: Push to GitHub

1. Go to https://github.com and create a new repository
2. Name it `cookbook-app` (or any name you like)
3. **Don't** initialize with README, .gitignore, or license
4. Copy the repository URL (looks like: `https://github.com/yourusername/cookbook-app.git`)

Then run:

```bash
git remote add origin YOUR_GITHUB_REPO_URL
git branch -M main
git push -u origin main
```

Replace `YOUR_GITHUB_REPO_URL` with your actual GitHub repository URL.

## Step 3: Deploy to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. Go to https://vercel.com and sign up/login (use GitHub to sign in)
2. Click **"Add New Project"**
3. Import your GitHub repository (`cookbook-app`)
4. Vercel will auto-detect Next.js settings
5. **Important**: Add your environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
6. Click **"Deploy"**

### Option B: Using Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Follow the prompts and add your environment variables when asked

## Step 4: Update Supabase Settings

After deployment, you'll get a URL like: `https://your-app.vercel.app`

1. **Update Supabase Redirect URLs:**
   - Go to Supabase Dashboard > Authentication > URL Configuration
   - Add your Vercel URL to "Redirect URLs":
     - `https://your-app.vercel.app/auth/callback`
   - Add your Vercel URL to "Site URL":
     - `https://your-app.vercel.app`

2. **Update Google OAuth (if using):**
   - Go to Google Cloud Console
   - Add authorized redirect URI:
     - `https://your-app.vercel.app/auth/callback`

## Step 5: Test on Your Phone

1. Open your phone's web browser
2. Go to your Vercel URL: `https://your-app.vercel.app`
3. Test sign up, login, and recipe creation!

## Troubleshooting

- **Build errors**: Check Vercel build logs for details
- **Environment variables**: Make sure both are set in Vercel dashboard
- **Authentication not working**: Verify Supabase redirect URLs are updated
- **Images/videos not loading**: Check Supabase storage bucket is public and policies are set

## Future Updates

After making code changes:

```bash
git add .
git commit -m "Your commit message"
git push
```

Vercel will automatically redeploy your app!

