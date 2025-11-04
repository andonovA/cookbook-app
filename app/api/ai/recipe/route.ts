import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { ingredients } = await request.json()

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json(
        { error: 'Please provide at least one ingredient' },
        { status: 400 }
      )
    }

    const apiKey = process.env.OPENAI_API_KEY || process.env.GROQ_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'AI API key not configured. Please set OPENAI_API_KEY or GROQ_API_KEY in environment variables.' },
        { status: 500 }
      )
    }

    const ingredientsList = ingredients.join(', ')
    
    // Use Groq API (free tier available) or OpenAI
    const useGroq = !!process.env.GROQ_API_KEY
    const apiUrl = useGroq
      ? 'https://api.groq.com/openai/v1/chat/completions'
      : 'https://api.openai.com/v1/chat/completions'

    const prompt = `You are a professional chef. Create a recipe using these ingredients: ${ingredientsList}

Please provide a recipe in the following JSON format:
{
  "title": "Recipe name",
  "description": "Brief description of the recipe",
  "ingredients": "List of all ingredients needed (including the ones provided, plus any common pantry items)",
  "instructions": "Step-by-step cooking instructions",
  "prep_time": number in minutes,
  "cook_time": number in minutes,
  "servings": number,
  "difficulty": "Easy" or "Medium" or "Hard",
  "category": "Breakfast" or "Lunch" or "Dinner" or "Dessert" or "Snack" or "Appetizer" or "Drink",
  "tags": ["tag1", "tag2", "tag3"]
}

Make sure to:
- Use most or all of the provided ingredients: ${ingredientsList}
- Include common pantry items (salt, pepper, oil, etc.) if needed
- Provide clear, step-by-step instructions
- Be creative but practical
- Return ONLY valid JSON, no markdown formatting`

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: useGroq ? 'llama-3.1-70b-versatile' : 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful chef assistant that creates recipes. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('AI API error:', errorData)
      return NextResponse.json(
        { error: `AI service error: ${response.statusText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    const aiResponse = data.choices[0]?.message?.content || ''

    // Try to parse JSON from the response
    let recipe
    try {
      // Remove markdown code blocks if present
      const cleanedResponse = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      recipe = JSON.parse(cleanedResponse)
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse)
      return NextResponse.json(
        { error: 'Failed to parse AI response. Please try again.' },
        { status: 500 }
      )
    }

    // Validate and format the recipe
    const formattedRecipe = {
      title: recipe.title || 'AI Generated Recipe',
      description: recipe.description || '',
      ingredients: recipe.ingredients || '',
      instructions: recipe.instructions || '',
      prep_time: parseInt(recipe.prep_time) || null,
      cook_time: parseInt(recipe.cook_time) || null,
      servings: parseInt(recipe.servings) || null,
      difficulty: recipe.difficulty || 'Medium',
      category: recipe.category || null,
      tags: Array.isArray(recipe.tags) ? recipe.tags : [],
    }

    return NextResponse.json({ recipe: formattedRecipe })
  } catch (error: any) {
    console.error('AI recipe generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate recipe' },
      { status: 500 }
    )
  }
}

