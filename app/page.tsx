import { createServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import RecipeFeed from '@/components/RecipeFeed'

export default async function Home() {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/login')
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Cookbook</h1>
        <p className="text-gray-600">Discover and share amazing recipes</p>
      </div>
      <RecipeFeed />
    </div>
  )
}

