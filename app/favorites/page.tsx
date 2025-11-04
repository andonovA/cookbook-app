'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'
import RecipeCard from '@/components/RecipeCard'
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
  user_id: string
  category: string | null
  tags: string[] | null
  prep_time: number | null
  cook_time: number | null
  servings: number | null
  difficulty: string | null
  user_profiles: {
    username: string | null
    full_name: string | null
    avatar_url: string | null
  } | null
}

export default function FavoritesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchFavorites()
  }, [])

  const fetchFavorites = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      // Fetch user's favorites with recipe details
      const { data: favorites, error: favoritesError } = await supabase
        .from('favorites')
        .select('recipe_id, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (favoritesError) throw favoritesError

      if (!favorites || favorites.length === 0) {
        setRecipes([])
        setLoading(false)
        return
      }

      // Get recipe IDs
      const recipeIds = favorites.map((f: any) => f.recipe_id)

      // Fetch full recipe details
      const { data: recipesData, error: recipesError } = await supabase
        .from('recipes')
        .select('*')
        .in('id', recipeIds)
        .order('created_at', { ascending: false })

      if (recipesError) throw recipesError

      // Try to get user profiles
      if (recipesData && recipesData.length > 0) {
        const userIds = Array.from(new Set(recipesData.map((r: any) => r.user_id)))
        
        let profiles: any[] | null = null
        try {
          const profileResult = await supabase
            .from('user_profiles')
            .select('id, username, full_name, avatar_url')
            .in('id', userIds)
          
          if (!profileResult.error && profileResult.data) {
            profiles = profileResult.data
          }
        } catch (err) {
          // user_profiles table might not exist
        }

        // Map profiles to recipes
        const profileMap = new Map()
        if (profiles) {
          profiles.forEach((profile: any) => {
            profileMap.set(profile.id, profile)
          })
        }

        const recipesWithProfiles = recipesData.map((recipe: any) => ({
          ...recipe,
          user_profiles: profileMap.get(recipe.user_id) || null
        }))

        setRecipes(recipesWithProfiles)
      } else {
        setRecipes([])
      }
    } catch (error) {
      console.error('Error fetching favorites:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Favorites</h1>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Favorites</h1>
        <p className="text-gray-600">Your saved recipes</p>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-12 card">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <p className="text-gray-500 text-lg mb-4">No favorites yet</p>
          <p className="text-gray-400 mb-6">Start saving recipes you love!</p>
          <Link href="/" className="btn-primary inline-block">
            Browse Recipes
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  )
}

