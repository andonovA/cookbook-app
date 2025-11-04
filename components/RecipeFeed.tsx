'use client'

import { useEffect, useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase-client'
import RecipeCard from './RecipeCard'
import SearchAndFilter from './SearchAndFilter'
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

export default function RecipeFeed() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const supabase = createClient()

  useEffect(() => {
    fetchRecipes()
  }, [])

  const fetchRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select(`
          *,
          user_profiles (
            username,
            full_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setRecipes(data || [])
    } catch (error) {
      console.error('Error fetching recipes:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter recipes based on search and category
  const filteredRecipes = useMemo(() => {
    let filtered = recipes

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (recipe) =>
          recipe.title.toLowerCase().includes(query) ||
          recipe.ingredients.toLowerCase().includes(query) ||
          recipe.description?.toLowerCase().includes(query)
      )
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(
        (recipe) =>
          recipe.category === selectedCategory ||
          recipe.tags?.includes(selectedCategory)
      )
    }

    return filtered
  }, [recipes, searchQuery, selectedCategory])

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

  if (recipes.length === 0 && !loading) {
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
    <div>
      <SearchAndFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {filteredRecipes.length === 0 && !loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No recipes found matching your search.</p>
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory('All')
            }}
            className="btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  )
}

