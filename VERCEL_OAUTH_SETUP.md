# Vercel OAuth Setup - Quick Fix

## Your Vercel App URL
```
https://cookbook-2ejg9v0bd-aleksandar-andonovs-projects.vercel.app
```

## Step 1: Configure Supabase Redirect URLs (CRITICAL)

1. Go to **Supabase Dashboard**
2. Navigate to **Authentication** → **URL Configuration**
3. Under **"Redirect URLs"**, add:
   ```
   https://cookbook-2ejg9v0bd-aleksandar-andonovs-projects.vercel.app/auth/callback
   ```
   ⚠️ **IMPORTANT**: 
   - No trailing slash
   - Exact match (copy-paste to avoid typos)
   - Make sure it's in the list

4. Under **"Site URL"**, set:
   ```
   https://cookbook-2ejg9v0bd-aleksandar-andonovs-projects.vercel.app
   ```

5. Click **"Save"** and wait a few seconds

## Step 2: Verify Google OAuth (Should already be done)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **APIs & Services** → **Credentials**
3. Your OAuth client should have:
   ```
   https://apsqigzyabtdwxzuojsz.supabase.co/auth/v1/callback
   ```
   ✅ This should already be set

## Step 3: Check Vercel Environment Variables

Make sure these are set in Vercel:

1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Verify you have:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Make sure they're set for **Production** environment

## Step 4: Test the Flow

1. **Clear browser cache/cookies** (or use incognito)
2. Go to: `https://cookbook-2ejg9v0bd-aleksandar-andonovs-projects.vercel.app`
3. Click "Sign in with Google"
4. Expected flow:
   - Redirect to Google login
   - After login, redirect to Supabase
   - Then redirect to `/auth/callback`
   - Then redirect to `/` (home)

## Debugging

If it still redirects to `/auth/login`:

1. **Open browser DevTools** (F12)
2. **Check Console tab** - Look for error messages
3. **Check Network tab** - Look for `/auth/callback` request
   - Click on it
   - Check the Response tab
   - Check if there's an error parameter in the URL

4. **Check the URL** when you're redirected back to login
   - It should look like: `/auth/login?error=...`
   - The error message will tell you what's wrong

## Common Issues

### Issue: "Invalid redirect_uri" error
**Fix**: Make sure Supabase has the exact Vercel callback URL (step 1)

### Issue: Redirects to login with no error
**Fix**: 
- Check Vercel logs: Vercel Dashboard → Your Project → Logs
- Look for errors in the callback route

### Issue: "Code exchange failed"
**Fix**: 
- Verify environment variables are set correctly
- Make sure Supabase URL and key are correct

## Most Likely Issue

Since you're being redirected back to login, the most common issue is:
- **Supabase redirect URL not configured** - Make sure `https://cookbook-2ejg9v0bd-aleksandar-andonovs-projects.vercel.app/auth/callback` is in Supabase's redirect URLs list

## Quick Test

After adding the redirect URL in Supabase:
1. Wait 10-15 seconds for changes to propagate
2. Try again in incognito mode
3. Check the URL when redirected - if there's `?error=...`, that will tell us what's wrong

