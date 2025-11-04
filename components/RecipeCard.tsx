'use client'

import Image from 'next/image'
import Link from 'next/link'

interface Recipe {
  id: string
  title: string
  description: string | null
  ingredients: string
  instructions: string
  photo_url: string | null
  video_url: string | null
  created_at: string
}

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <Link href={`/recipes/${recipe.id}`} className="block">
      <article className="card hover:shadow-lg transition-shadow">
        {recipe.photo_url && (
          <div className="relative w-full h-64 mb-4 rounded-lg overflow-hidden">
            <Image
              src={recipe.photo_url}
              alt={recipe.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        
        {recipe.video_url && !recipe.photo_url && (
          <div className="w-full h-64 mb-4 rounded-lg overflow-hidden bg-black">
            <video
              src={recipe.video_url}
              controls
              className="w-full h-full object-contain"
            />
          </div>
        )}

        <h2 className="text-2xl font-bold text-gray-900 mb-2">{recipe.title}</h2>
        
        {recipe.description && (
          <p className="text-gray-600 mb-4 line-clamp-2">{recipe.description}</p>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{formatDate(recipe.created_at)}</span>
          <span className="text-primary-600 font-medium">View Recipe →</span>
        </div>
      </article>
    </Link>
  )
}

