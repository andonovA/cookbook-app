import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error_param = requestUrl.searchParams.get('error')
  const error_description = requestUrl.searchParams.get('error_description')
  const next = requestUrl.searchParams.get('next') || '/'

  // Check for OAuth errors from Supabase
  if (error_param) {
    console.error('OAuth error from Supabase:', error_param, error_description)
    const errorMessage = error_description || error_param || 'Authentication failed'
    const errorUrl = new URL(`/auth/login?error=${encodeURIComponent(errorMessage)}`, requestUrl.origin)
    return NextResponse.redirect(errorUrl)
  }

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerComponentClient({ cookies: () => cookieStore })
    
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (!error && data.session) {
        // Successfully authenticated, redirect to home
        const redirectUrl = new URL(next, requestUrl.origin)
        return NextResponse.redirect(redirectUrl)
      }
      
      // If there's an error, redirect to login with error message
      console.error('OAuth callback error:', error)
      const errorMessage = error?.message || 'Failed to exchange code for session'
      const errorUrl = new URL(`/auth/login?error=${encodeURIComponent(errorMessage)}`, requestUrl.origin)
      return NextResponse.redirect(errorUrl)
    } catch (err: any) {
      console.error('OAuth callback exception:', err)
      const errorUrl = new URL(`/auth/login?error=${encodeURIComponent(err.message || 'Authentication failed')}`, requestUrl.origin)
      return NextResponse.redirect(errorUrl)
    }
  }

  // No code provided, redirect to login
  console.warn('OAuth callback called without code parameter')
  return NextResponse.redirect(new URL('/auth/login', requestUrl.origin))
}

