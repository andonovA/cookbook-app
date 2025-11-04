'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'

export default function RecipeActions({ recipeId }: { recipeId: string }) {
  const router = useRouter()
  const supabase = createClient()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
      return
    }

    setDeleting(true)
    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', recipeId)

      if (error) throw error

      router.push('/')
    } catch (error) {
      console.error('Error deleting recipe:', error)
      alert('Failed to delete recipe. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex justify-end gap-2 mb-4">
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
      >
        {deleting ? 'Deleting...' : 'Delete Recipe'}
      </button>
    </div>
  )
}

