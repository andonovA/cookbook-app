import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/'

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerComponentClient({ cookies: () => cookieStore })
    
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (!error) {
        // Successfully authenticated, redirect to home
        const redirectUrl = new URL(next, requestUrl.origin)
        return NextResponse.redirect(redirectUrl)
      }
      
      // If there's an error, redirect to login with error message
      console.error('OAuth callback error:', error)
      const errorUrl = new URL(`/auth/login?error=${encodeURIComponent(error.message)}`, requestUrl.origin)
      return NextResponse.redirect(errorUrl)
    } catch (err: any) {
      console.error('OAuth callback exception:', err)
      const errorUrl = new URL(`/auth/login?error=${encodeURIComponent(err.message || 'Authentication failed')}`, requestUrl.origin)
      return NextResponse.redirect(errorUrl)
    }
  }

  // No code provided, redirect to login
  return NextResponse.redirect(new URL('/auth/login', requestUrl.origin))
}

