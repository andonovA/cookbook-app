'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'

interface FavoriteButtonProps {
  recipeId: string
  className?: string
}

export default function FavoriteButton({ recipeId, className = '' }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    checkFavorite()
  }, [recipeId])

  const checkFavorite = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setChecking(false)
        return
      }

      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('recipe_id', recipeId)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error checking favorite:', error)
      }

      setIsFavorite(!!data)
    } catch (error) {
      console.error('Error checking favorite:', error)
    } finally {
      setChecking(false)
    }
  }

  const toggleFavorite = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert('Please sign in to save recipes')
        return
      }

      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('recipe_id', recipeId)

        if (error) throw error
        setIsFavorite(false)
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            recipe_id: recipeId,
          })

        if (error) throw error
        setIsFavorite(true)
      }
    } catch (error: any) {
      console.error('Error toggling favorite:', error)
      alert('Failed to update favorite. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <button
        disabled
        className={`${className} opacity-50 cursor-not-allowed`}
        aria-label="Loading"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>
    )
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`${className} transition-colors hover:scale-110 active:scale-95 disabled:opacity-50`}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isFavorite ? (
        <svg className="w-5 h-5 text-red-500 fill-current" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-gray-400 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )}
    </button>
  )
}

