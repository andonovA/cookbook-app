'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { useForm } from 'react-hook-form'

interface IngredientForm {
  ingredients: string
}

interface GeneratedRecipe {
  title: string
  description: string
  ingredients: string
  instructions: string
  prep_time: number | null
  cook_time: number | null
  servings: number | null
  difficulty: string
  category: string | null
  tags: string[]
}

export default function AIRecipesPage() {
  const [ingredients, setIngredients] = useState<string[]>([])
  const [currentIngredient, setCurrentIngredient] = useState('')
  const [generatedRecipe, setGeneratedRecipe] = useState<GeneratedRecipe | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const addIngredient = () => {
    const trimmed = currentIngredient.trim()
    if (trimmed && !ingredients.includes(trimmed.toLowerCase())) {
      setIngredients([...ingredients, trimmed.toLowerCase()])
      setCurrentIngredient('')
    }
  }

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addIngredient()
    }
  }

  const generateRecipe = async () => {
    if (ingredients.length === 0) {
      setError('Please add at least one ingredient')
      return
    }

    setLoading(true)
    setError('')
    setGeneratedRecipe(null)

    try {
      const response = await fetch('/api/ai/recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate recipe')
      }

      setGeneratedRecipe(data.recipe)
    } catch (err: any) {
      setError(err.message || 'Failed to generate recipe. Please try again.')
      console.error('Error generating recipe:', err)
    } finally {
      setLoading(false)
    }
  }

  const saveRecipe = async () => {
    if (!generatedRecipe) return

    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      const { error } = await supabase
        .from('recipes')
        .insert({
          user_id: user.id,
          title: generatedRecipe.title,
          description: generatedRecipe.description,
          ingredients: generatedRecipe.ingredients,
          instructions: generatedRecipe.instructions,
          prep_time: generatedRecipe.prep_time,
          cook_time: generatedRecipe.cook_time,
          servings: generatedRecipe.servings,
          difficulty: generatedRecipe.difficulty,
          category: generatedRecipe.category,
          tags: generatedRecipe.tags.length > 0 ? generatedRecipe.tags : null,
        })

      if (error) throw error

      router.push('/')
    } catch (err: any) {
      setError(err.message || 'Failed to save recipe')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Recipe Generator</h1>
        <p className="text-gray-600">
          Tell us what ingredients you have, and we'll create a recipe for you!
        </p>
      </div>

      <div className="card mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Your Ingredients</h2>
        
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={currentIngredient}
            onChange={(e) => setCurrentIngredient(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter an ingredient (e.g., chicken, tomatoes, pasta)"
            className="input-field flex-1"
          />
          <button
            onClick={addIngredient}
            className="btn-primary whitespace-nowrap"
          >
            Add
          </button>
        </div>

        {ingredients.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {ingredients.map((ingredient, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm flex items-center gap-2"
              >
                {ingredient}
                <button
                  onClick={() => removeIngredient(index)}
                  className="hover:text-primary-900"
                  aria-label="Remove ingredient"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}

        <button
          onClick={generateRecipe}
          disabled={loading || ingredients.length === 0}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Generating Recipe...' : 'Generate Recipe with AI'}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
      </div>

      {loading && (
        <div className="card text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">AI is creating your recipe...</p>
        </div>
      )}

      {generatedRecipe && (
        <div className="card">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{generatedRecipe.title}</h2>
              {generatedRecipe.description && (
                <p className="text-gray-600">{generatedRecipe.description}</p>
              )}
            </div>
            <button
              onClick={saveRecipe}
              disabled={saving}
              className="btn-primary whitespace-nowrap"
            >
              {saving ? 'Saving...' : 'Save Recipe'}
            </button>
          </div>

          <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600">
            {generatedRecipe.prep_time && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {generatedRecipe.prep_time} min prep
              </span>
            )}
            {generatedRecipe.cook_time && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {generatedRecipe.cook_time} min cook
              </span>
            )}
            {generatedRecipe.servings && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Serves {generatedRecipe.servings}
              </span>
            )}
            {generatedRecipe.difficulty && (
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                generatedRecipe.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                generatedRecipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {generatedRecipe.difficulty}
              </span>
            )}
          </div>

          {(generatedRecipe.category || generatedRecipe.tags.length > 0) && (
            <div className="flex flex-wrap gap-2 mb-6">
              {generatedRecipe.category && (
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                  {generatedRecipe.category}
                </span>
              )}
              {generatedRecipe.tags.map((tag, idx) => (
                <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8 mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Ingredients</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="whitespace-pre-wrap text-gray-700 font-sans">
                  {generatedRecipe.ingredients}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Instructions</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="whitespace-pre-wrap text-gray-700 font-sans">
                  {generatedRecipe.instructions}
                </pre>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 italic">
              This recipe was generated by AI. Feel free to edit and customize it before saving!
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

