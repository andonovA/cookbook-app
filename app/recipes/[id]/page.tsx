import { createServerClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import RecipeActions from '@/components/RecipeActions'

export default async function RecipePage({ params }: { params: { id: string } }) {
  const supabase = createServerClient()
  const { data: recipe, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !recipe) {
    notFound()
  }

  // Fetch user profile separately (if table exists)
  // This will fail gracefully if table doesn't exist or relationship isn't defined
  let userProfile = null
  const profileResult = await supabase
    .from('user_profiles')
    .select('username, full_name, avatar_url')
    .eq('id', recipe.user_id)
    .single()
  
  // Only use profile if query succeeded and no error
  // Ignore errors about missing relationships - table might not exist yet
  if (!profileResult.error && profileResult.data) {
    userProfile = profileResult.data
  }
  // Silently ignore errors - user_profiles table might not exist or migration not run yet

  const { data: { user } } = await supabase.auth.getUser()
  const isOwner = user?.id === recipe.user_id

  // Add user profile to recipe object for compatibility
  const recipeWithProfile = {
    ...recipe,
    user_profiles: userProfile
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <article className="card">
        {recipeWithProfile.photo_url && (
          <div className="relative w-full h-96 mb-6 rounded-lg overflow-hidden">
            <Image
              src={recipeWithProfile.photo_url}
              alt={recipeWithProfile.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
        )}

        {recipeWithProfile.video_url && !recipeWithProfile.photo_url && (
          <div className="w-full mb-6 rounded-lg overflow-hidden bg-black">
            <video
              src={recipeWithProfile.video_url}
              controls
              className="w-full max-h-96"
            />
          </div>
        )}

        {isOwner && <RecipeActions recipeId={recipeWithProfile.id} />}

        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{recipeWithProfile.title}</h1>
            
            {/* User Info */}
            {recipeWithProfile.user_profiles && (
              <Link
                href={`/users/${recipe.user_id}`}
                className="flex items-center gap-2 mb-3 text-gray-600 hover:text-primary-600"
              >
                {recipeWithProfile.user_profiles.avatar_url ? (
                  <Image
                    src={recipeWithProfile.user_profiles.avatar_url}
                    alt={recipeWithProfile.user_profiles.full_name || recipeWithProfile.user_profiles.username || 'User'}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary-200 flex items-center justify-center text-primary-700 text-sm font-medium">
                    {(recipeWithProfile.user_profiles.full_name || recipeWithProfile.user_profiles.username || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span>{recipeWithProfile.user_profiles.full_name || recipeWithProfile.user_profiles.username || 'Anonymous'}</span>
              </Link>
            )}
          </div>
          
          {recipeWithProfile.difficulty && (
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              recipeWithProfile.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
              recipeWithProfile.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {recipeWithProfile.difficulty}
            </span>
          )}
        </div>

        {/* Recipe Metadata */}
        <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
          {recipeWithProfile.prep_time && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {recipeWithProfile.prep_time} min prep
            </span>
          )}
          {recipeWithProfile.cook_time && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {recipeWithProfile.cook_time} min cook
            </span>
          )}
          {recipeWithProfile.servings && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Serves {recipeWithProfile.servings}
            </span>
          )}
        </div>

        {/* Category and Tags */}
        {(recipeWithProfile.category || recipeWithProfile.tags) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {recipeWithProfile.category && (
              <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                {recipeWithProfile.category}
              </span>
            )}
            {recipeWithProfile.tags && recipeWithProfile.tags.map((tag: string, idx: number) => (
              <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
        )}

        {recipeWithProfile.description && (
          <p className="text-lg text-gray-600 mb-6">{recipeWithProfile.description}</p>
        )}

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ingredients</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <pre className="whitespace-pre-wrap text-gray-700 font-sans">
                {recipeWithProfile.ingredients}
              </pre>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Instructions</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <pre className="whitespace-pre-wrap text-gray-700 font-sans">
                {recipeWithProfile.instructions}
              </pre>
            </div>
          </div>
        </div>

        {recipeWithProfile.video_url && recipeWithProfile.photo_url && (
          <div className="mt-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Video Tutorial</h2>
            <div className="w-full rounded-lg overflow-hidden bg-black">
              <video
                src={recipeWithProfile.video_url}
                controls
                className="w-full"
              />
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Created on {new Date(recipeWithProfile.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </article>
    </div>
  )
}

