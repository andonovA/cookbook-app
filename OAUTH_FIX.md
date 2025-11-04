# Fixing Google OAuth Redirect Issue

## Problem
After signing in with Google, you're redirected to localhost but nothing happens.

## Solution

### 1. Check Supabase Redirect URL Configuration

The redirect URL must be configured in Supabase:

1. Go to your **Supabase Dashboard**
2. Navigate to **Authentication** → **URL Configuration**
3. Under **"Redirect URLs"**, make sure you have:
   - `http://localhost:3000/auth/callback` (for local development)
   - `https://your-app.vercel.app/auth/callback` (for production)
4. Under **"Site URL"**, set:
   - `http://localhost:3000` (for local development)
   - `https://your-app.vercel.app` (for production)
5. Click **"Save"**

### 2. Check Google OAuth Configuration

If you're using Google OAuth:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **APIs & Services** → **Credentials**
3. Click on your OAuth 2.0 Client ID
4. Under **"Authorized redirect URIs"**, add:
   - `https://your-project-ref.supabase.co/auth/v1/callback`
   - (This is your Supabase project's callback URL, not your app's URL)
5. Click **"Save"**

### 3. Verify Callback Route

The callback route at `/app/auth/callback/route.ts` should:
- Exchange the OAuth code for a session
- Redirect to the home page on success
- Redirect to login with error message on failure

### 4. Test the Flow

1. Click "Sign in with Google"
2. You should be redirected to Google's login page
3. After logging in, you should be redirected to `/auth/callback`
4. The callback should exchange the code and redirect you to `/`

### 5. Common Issues

**Issue: Stuck on localhost after Google login**
- **Fix**: Check that `http://localhost:3000/auth/callback` is in Supabase redirect URLs

**Issue: "Invalid redirect_uri" error**
- **Fix**: Make sure Google OAuth has the Supabase callback URL, not your app's URL

**Issue: "No code provided" error**
- **Fix**: Check browser console for errors, verify callback route is working

**Issue: Session not persisting**
- **Fix**: Make sure cookies are being set correctly (check browser DevTools → Application → Cookies)

### 6. Debugging

Open browser DevTools (F12) and check:
1. **Console tab** - Look for JavaScript errors
2. **Network tab** - Check if `/auth/callback` is being called
3. **Application tab** → **Cookies** - Check if Supabase session cookies are set

### 7. Code Changes Made

✅ Updated callback route to properly handle OAuth code exchange
✅ Added error handling and redirect to login on failure
✅ Added error message display in login page
✅ Fixed cookie handling for Next.js 14

The callback route now:
- Uses `createServerComponentClient` with proper cookie handling
- Exchanges the OAuth code for a session
- Redirects to home on success
- Shows error messages on failure

