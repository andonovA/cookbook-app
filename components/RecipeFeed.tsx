'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import RecipeCard from './RecipeCard'
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
}

export default function RecipeFeed() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchRecipes()
  }, [])

  const fetchRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setRecipes(data || [])
    } catch (error) {
      console.error('Error fetching recipes:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
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
    )
  }

  if (recipes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg mb-4">No recipes yet. Be the first to share one!</p>
        <Link href="/recipes/new" className="btn-primary inline-block">
          Create Your First Recipe
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  )
}

