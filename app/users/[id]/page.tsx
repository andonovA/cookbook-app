import { createServerClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import RecipeCard from '@/components/RecipeCard'

export default async function UserProfilePage({ params }: { params: { id: string } }) {
  const supabase = createServerClient()
  
  // Fetch user profile
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', params.id)
    .single()

  if (profileError || !profile) {
    notFound()
  }

  // Fetch user's recipes
  const { data: recipes, error: recipesError } = await supabase
    .from('recipes')
    .select('*')
    .eq('user_id', params.id)
    .order('created_at', { ascending: false })

  if (recipesError) {
    console.error('Error fetching recipes:', recipesError)
  }

  // Add profile to each recipe for compatibility
  const recipesWithProfiles = recipes?.map((recipe: any) => ({
    ...recipe,
    user_profiles: profile
  })) || []

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Profile Header */}
      <div className="card mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={profile.full_name || profile.username || 'User'}
              width={120}
              height={120}
              className="rounded-full"
            />
          ) : (
            <div className="w-30 h-30 rounded-full bg-primary-200 flex items-center justify-center text-primary-700 text-4xl font-bold">
              {(profile.full_name || profile.username || 'U')[0].toUpperCase()}
            </div>
          )}
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {profile.full_name || profile.username || 'Anonymous User'}
            </h1>
            {profile.username && (
              <p className="text-gray-600 mb-2">@{profile.username}</p>
            )}
            {profile.bio && (
              <p className="text-gray-700 mb-4">{profile.bio}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="font-medium">{recipesWithProfiles?.length || 0} Recipes</span>
              <span>Joined {new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* User's Recipes */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {profile.full_name || profile.username}'s Recipes
        </h2>
        
        {!recipesWithProfiles || recipesWithProfiles.length === 0 ? (
          <div className="text-center py-12 card">
            <p className="text-gray-500 text-lg mb-4">No recipes yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {recipesWithProfiles.map((recipe: any) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

