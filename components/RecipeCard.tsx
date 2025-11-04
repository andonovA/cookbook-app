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
  category: string | null
  tags: string[] | null
  prep_time: number | null
  cook_time: number | null
  servings: number | null
  difficulty: string | null
  user_id: string
  user_profiles: {
    username: string | null
    full_name: string | null
    avatar_url: string | null
  } | null
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

        <div className="flex items-start justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-900 flex-1">{recipe.title}</h2>
          {recipe.difficulty && (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
              recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {recipe.difficulty}
            </span>
          )}
        </div>

        {/* User Info */}
        {recipe.user_profiles && (
          <Link
            href={`/users/${recipe.user_id}`}
            className="flex items-center gap-2 mb-3 text-sm text-gray-600 hover:text-primary-600"
          >
            {recipe.user_profiles.avatar_url ? (
              <img
                src={recipe.user_profiles.avatar_url}
                alt={recipe.user_profiles.full_name || recipe.user_profiles.username || 'User'}
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-primary-200 flex items-center justify-center text-primary-700 text-xs font-medium">
                {(recipe.user_profiles.full_name || recipe.user_profiles.username || 'U')[0].toUpperCase()}
              </div>
            )}
            <span>{recipe.user_profiles.full_name || recipe.user_profiles.username || 'Anonymous'}</span>
          </Link>
        )}

        {/* Category and Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {recipe.category && (
            <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-medium">
              {recipe.category}
            </span>
          )}
          {recipe.tags && recipe.tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
              {tag}
            </span>
          ))}
        </div>

        {/* Recipe Info */}
        <div className="flex flex-wrap gap-4 mb-3 text-sm text-gray-600">
          {recipe.prep_time && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {recipe.prep_time} min prep
            </span>
          )}
          {recipe.cook_time && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {recipe.cook_time} min cook
            </span>
          )}
          {recipe.servings && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Serves {recipe.servings}
            </span>
          )}
        </div>
        
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

