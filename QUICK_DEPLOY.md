# Quick Deployment Guide

## 🚀 Deploy in 3 Steps

### Step 1: Push to GitHub (5 minutes)

1. **Create GitHub Repository:**
   - Go to https://github.com/new
   - Repository name: `cookbook-app`
   - Choose **Private** or **Public** (your choice)
   - **Don't** check any boxes (README, .gitignore, license)
   - Click **"Create repository"**

2. **Push Your Code:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/cookbook-app.git
   git branch -M main
   git push -u origin main
   ```
   Replace `YOUR_USERNAME` with your GitHub username!

### Step 2: Deploy to Vercel (3 minutes)

1. **Sign up/Login:**
   - Go to https://vercel.com
   - Click **"Sign Up"** → Use GitHub to sign in

2. **Import Project:**
   - Click **"Add New Project"**
   - Select your `cookbook-app` repository
   - Click **"Import"**

3. **Add Environment Variables:**
   - Under "Environment Variables", add:
     - **Key:** `NEXT_PUBLIC_SUPABASE_URL`
     - **Value:** Your Supabase project URL (from Supabase dashboard > Settings > API)
     - Click **"Add"**
   
   - Add second variable:
     - **Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - **Value:** Your Supabase anon key (from same place)
     - Click **"Add"**

4. **Deploy:**
   - Click **"Deploy"**
   - Wait 2-3 minutes for build to complete
   - You'll get a URL like: `https://cookbook-app-xxx.vercel.app`

### Step 3: Update Supabase (2 minutes)

1. **Copy your Vercel URL** (from deployment page)

2. **Update Supabase Redirect URLs:**
   - Go to Supabase Dashboard: https://app.supabase.com
   - Select your project
   - Go to **Authentication** → **URL Configuration**
   - Under **"Redirect URLs"**, add:
     ```
     https://your-app.vercel.app/auth/callback
     ```
   - Under **"Site URL"**, set:
     ```
     https://your-app.vercel.app
     ```
   - Click **"Save"**

3. **If using Google OAuth:**
   - Go to Google Cloud Console
   - Add redirect URI: `https://your-app.vercel.app/auth/callback`

## ✅ Done!

Open `https://your-app.vercel.app` on your phone and test it!

## 📱 Testing on Phone

1. Open your phone's browser (Chrome, Safari, etc.)
2. Go to your Vercel URL
3. Sign up with email or Google
4. Create a recipe with photos/videos
5. Everything should work! 🎉

## 🔄 Making Updates

When you change code:
```bash
git add .
git commit -m "Your changes"
git push
```
Vercel automatically redeploys! ✨

