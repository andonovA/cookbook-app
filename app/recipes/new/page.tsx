'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { useForm } from 'react-hook-form'

interface RecipeForm {
  title: string
  description: string
  ingredients: string
  instructions: string
  category: string
  tags: string
  prep_time: string
  cook_time: string
  servings: string
  difficulty: string
}

export default function NewRecipePage() {
  const router = useRouter()
  const supabase = createClient()
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<RecipeForm>()

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setVideoFile(file)
      setVideoPreview(URL.createObjectURL(file))
    }
  }

  const uploadFile = async (file: File, path: string): Promise<string | null> => {
    const { data, error } = await supabase.storage
      .from('recipe-media')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Upload error:', error)
      return null
    }

    const { data: { publicUrl } } = supabase.storage
      .from('recipe-media')
      .getPublicUrl(data.path)

    return publicUrl
  }

  const onSubmit = async (data: RecipeForm) => {
    setUploading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      let photoUrl: string | null = null
      let videoUrl: string | null = null

      // Upload photo if provided
      if (photoFile) {
        const photoPath = `${user.id}/${Date.now()}-${photoFile.name}`
        photoUrl = await uploadFile(photoFile, photoPath)
      }

      // Upload video if provided
      if (videoFile) {
        const videoPath = `${user.id}/${Date.now()}-${videoFile.name}`
        videoUrl = await uploadFile(videoFile, videoPath)
      }

      // Parse tags
      const tags = data.tags
        ? data.tags.split(',').map((tag) => tag.trim()).filter((tag) => tag.length > 0)
        : null

      // Insert recipe into database
      const { error } = await supabase
        .from('recipes')
        .insert({
          user_id: user.id,
          title: data.title,
          description: data.description || null,
          ingredients: data.ingredients,
          instructions: data.instructions,
          photo_url: photoUrl,
          video_url: videoUrl,
          category: data.category || null,
          tags: tags,
          prep_time: data.prep_time ? parseInt(data.prep_time) : null,
          cook_time: data.cook_time ? parseInt(data.cook_time) : null,
          servings: data.servings ? parseInt(data.servings) : null,
          difficulty: data.difficulty || null,
        })

      if (error) throw error

      router.push('/')
    } catch (error) {
      console.error('Error creating recipe:', error)
      alert('Failed to create recipe. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Recipe</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Recipe Title *
          </label>
          <input
            id="title"
            type="text"
            {...register('title', { required: 'Title is required' })}
            className="input-field"
            placeholder="e.g., Classic Chocolate Chip Cookies"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            {...register('description')}
            className="input-field"
            rows={3}
            placeholder="A brief description of your recipe..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              id="category"
              {...register('category')}
              className="input-field"
            >
              <option value="">Select a category</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Dessert">Dessert</option>
              <option value="Snack">Snack</option>
              <option value="Appetizer">Appetizer</option>
              <option value="Drink">Drink</option>
            </select>
          </div>

          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty
            </label>
            <select
              id="difficulty"
              {...register('difficulty')}
              className="input-field"
            >
              <option value="">Select difficulty</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div>
            <label htmlFor="prep_time" className="block text-sm font-medium text-gray-700 mb-2">
              Prep Time (minutes)
            </label>
            <input
              id="prep_time"
              type="number"
              {...register('prep_time')}
              className="input-field"
              placeholder="e.g., 15"
              min="0"
            />
          </div>

          <div>
            <label htmlFor="cook_time" className="block text-sm font-medium text-gray-700 mb-2">
              Cook Time (minutes)
            </label>
            <input
              id="cook_time"
              type="number"
              {...register('cook_time')}
              className="input-field"
              placeholder="e.g., 30"
              min="0"
            />
          </div>

          <div>
            <label htmlFor="servings" className="block text-sm font-medium text-gray-700 mb-2">
              Servings
            </label>
            <input
              id="servings"
              type="number"
              {...register('servings')}
              className="input-field"
              placeholder="e.g., 4"
              min="1"
            />
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma-separated)
            </label>
            <input
              id="tags"
              type="text"
              {...register('tags')}
              className="input-field"
              placeholder="e.g., Vegetarian, Spicy, Quick"
            />
            <p className="mt-1 text-xs text-gray-500">Separate tags with commas</p>
          </div>
        </div>

        <div>
          <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700 mb-2">
            Ingredients *
          </label>
          <textarea
            id="ingredients"
            {...register('ingredients', { required: 'Ingredients are required' })}
            className="input-field"
            rows={6}
            placeholder="List ingredients, one per line or separated by commas..."
          />
          {errors.ingredients && (
            <p className="mt-1 text-sm text-red-600">{errors.ingredients.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-2">
            Instructions *
          </label>
          <textarea
            id="instructions"
            {...register('instructions', { required: 'Instructions are required' })}
            className="input-field"
            rows={8}
            placeholder="Step-by-step cooking instructions..."
          />
          {errors.instructions && (
            <p className="mt-1 text-sm text-red-600">{errors.instructions.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-2">
            Recipe Photo
          </label>
          <input
            id="photo"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="input-field"
          />
          {photoPreview && (
            <div className="mt-4 relative w-full h-64 rounded-lg overflow-hidden">
              <img
                src={photoPreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        <div>
          <label htmlFor="video" className="block text-sm font-medium text-gray-700 mb-2">
            Recipe Video
          </label>
          <input
            id="video"
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className="input-field"
          />
          {videoPreview && (
            <div className="mt-4 w-full rounded-lg overflow-hidden">
              <video
                src={videoPreview}
                controls
                className="w-full max-h-64"
              />
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={uploading}
            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Creating...' : 'Create Recipe'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-secondary"
            disabled={uploading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

