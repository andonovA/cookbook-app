# Google OAuth Setup Guide - Step by Step

## The OAuth Flow

1. User clicks "Sign in with Google" in your app
2. Your app → Supabase (with redirect URL)
3. Supabase → Google OAuth
4. Google → Supabase callback
5. Supabase → Your app callback

## Configuration Steps

### Step 1: Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **APIs & Services** → **Credentials**
3. Click on your **OAuth 2.0 Client ID**
4. Under **"Authorized redirect URIs"**, add:
   ```
   https://apsqigzyabtdwxzuojsz.supabase.co/auth/v1/callback
   ```
   ✅ **This is correct!** (Supabase's callback URL)

5. Click **"Save"**

### Step 2: Supabase Dashboard - CRITICAL

1. Go to your **Supabase Dashboard**
2. Navigate to **Authentication** → **URL Configuration**
3. Under **"Redirect URLs"**, add:
   ```
   http://localhost:3000/auth/callback
   ```
   (For production, also add: `https://your-app.vercel.app/auth/callback`)

4. Under **"Site URL"**, set:
   ```
   http://localhost:3000
   ```
   (For production: `https://your-app.vercel.app`)

5. Click **"Save"**

### Step 3: Verify Your Code

The code should use:
```javascript
redirectTo: `${window.location.origin}/auth/callback`
```

This will be:
- `http://localhost:3000/auth/callback` (locally)
- `https://your-app.vercel.app/auth/callback` (production)

## Common Issues

### Issue: Redirects to localhost but nothing happens

**Cause**: Supabase redirect URL not configured

**Fix**:
1. Double-check Supabase Dashboard → Authentication → URL Configuration
2. Make sure `http://localhost:3000/auth/callback` is in the list
3. Make sure there's no trailing slash
4. Click "Save" and wait a few seconds

### Issue: "Invalid redirect_uri" error from Google

**Cause**: Google OAuth doesn't have Supabase's callback URL

**Fix**:
1. Go to Google Cloud Console
2. Add: `https://apsqigzyabtdwxzuojsz.supabase.co/auth/v1/callback`
3. Make sure it matches exactly (no trailing space)

### Issue: Redirects to localhost but shows error

**Check**:
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Check Network tab - look for `/auth/callback` request
4. Check what error message appears

## Testing

1. **Clear browser cache/cookies** (important!)
2. Open your app: `http://localhost:3000`
3. Click "Sign in with Google"
4. You should:
   - Be redirected to Google login
   - After login, redirected to Supabase
   - Then redirected to `http://localhost:3000/auth/callback`
   - Then automatically redirected to `http://localhost:3000/` (home)

## Debug Checklist

- [ ] Google OAuth has Supabase callback URL: `https://apsqigzyabtdwxzuojsz.supabase.co/auth/v1/callback`
- [ ] Supabase has your app callback URL: `http://localhost:3000/auth/callback`
- [ ] Supabase Site URL is set: `http://localhost:3000`
- [ ] Code uses: `redirectTo: ${window.location.origin}/auth/callback`
- [ ] Browser cache/cookies cleared
- [ ] No browser extensions blocking redirects

## Still Not Working?

1. **Check browser console** (F12) for errors
2. **Check Network tab** - see if `/auth/callback` is being called
3. **Check Supabase logs** - Dashboard → Logs → Auth
4. **Try incognito mode** - to rule out cache/cookie issues

