import { createServerClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
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

  const { data: { user } } = await supabase.auth.getUser()
  const isOwner = user?.id === recipe.user_id

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <article className="card">
        {recipe.photo_url && (
          <div className="relative w-full h-96 mb-6 rounded-lg overflow-hidden">
            <Image
              src={recipe.photo_url}
              alt={recipe.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
        )}

        {recipe.video_url && !recipe.photo_url && (
          <div className="w-full mb-6 rounded-lg overflow-hidden bg-black">
            <video
              src={recipe.video_url}
              controls
              className="w-full max-h-96"
            />
          </div>
        )}

        {isOwner && <RecipeActions recipeId={recipe.id} />}

        <h1 className="text-4xl font-bold text-gray-900 mb-4">{recipe.title}</h1>

        {recipe.description && (
          <p className="text-lg text-gray-600 mb-6">{recipe.description}</p>
        )}

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ingredients</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <pre className="whitespace-pre-wrap text-gray-700 font-sans">
                {recipe.ingredients}
              </pre>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Instructions</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <pre className="whitespace-pre-wrap text-gray-700 font-sans">
                {recipe.instructions}
              </pre>
            </div>
          </div>
        </div>

        {recipe.video_url && recipe.photo_url && (
          <div className="mt-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Video Tutorial</h2>
            <div className="w-full rounded-lg overflow-hidden bg-black">
              <video
                src={recipe.video_url}
                controls
                className="w-full"
              />
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Created on {new Date(recipe.created_at).toLocaleDateString('en-US', {
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

