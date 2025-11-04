# AI Recipe Generator Setup

## Overview

The AI Recipe Generator allows users to input ingredients they have, and AI will create a recipe for them!

## Features

- ✅ Input multiple ingredients
- ✅ AI generates complete recipe with title, description, ingredients, instructions
- ✅ Includes prep time, cook time, servings, difficulty, category, and tags
- ✅ Save AI-generated recipes to your collection
- ✅ Free to use (with free tier API)

## Setup Instructions

### Option 1: Using Groq API (Recommended - Free Tier)

1. **Sign up for Groq API** (Free tier available):
   - Go to https://console.groq.com/
   - Sign up for a free account
   - Go to API Keys section
   - Create a new API key
   - Copy your API key

2. **Add to Environment Variables**:
   
   **Local Development (.env.local):**
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   ```

   **Vercel Production:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add: `GROQ_API_KEY` = `your_groq_api_key_here`
   - Select "Production", "Preview", and "Development"
   - Click "Save"
   - Redeploy your app

### Option 2: Using OpenAI API

1. **Get OpenAI API Key**:
   - Go to https://platform.openai.com/api-keys
   - Sign up or log in
   - Create a new API key
   - Copy your API key

2. **Add to Environment Variables**:
   
   **Local Development (.env.local):**
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

   **Vercel Production:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add: `OPENAI_API_KEY` = `your_openai_api_key_here`
   - Select "Production", "Preview", and "Development"
   - Click "Save"
   - Redeploy your app

## How It Works

1. User adds ingredients they have
2. Clicks "Generate Recipe with AI"
3. AI creates a complete recipe using those ingredients
4. User can review and save the recipe

## Free Tier Limits

### Groq API (Recommended)
- ✅ **Free tier available**
- ✅ Fast responses
- ✅ Uses Llama 3.1 model
- Check https://console.groq.com/ for current limits

### OpenAI API
- ⚠️ Requires paid account (but has pay-as-you-go)
- Uses GPT-3.5-turbo (cost-effective)
- Check https://platform.openai.com/pricing for current pricing

## Testing

1. Make sure you have the API key set in environment variables
2. Go to `/ai-recipes` page
3. Add some ingredients (e.g., "chicken", "tomatoes", "pasta")
4. Click "Generate Recipe with AI"
5. Wait for the AI to generate the recipe
6. Review and save if you like it!

## Troubleshooting

**Error: "AI API key not configured"**
- Make sure you've added `GROQ_API_KEY` or `OPENAI_API_KEY` to your environment variables
- Restart your dev server if testing locally
- Redeploy on Vercel if in production

**Error: "Failed to generate recipe"**
- Check that your API key is valid
- Check API service status
- Verify you haven't exceeded free tier limits

**Recipe format issues**
- The AI tries to return JSON, but sometimes formatting can be off
- If this happens, try generating again
- The error message will tell you what went wrong

## Security

- API keys are stored as environment variables (never exposed to client)
- API route is server-side only
- Users must be authenticated to save recipes

## Cost

- **Groq**: Free tier available (check their website for limits)
- **OpenAI**: Pay-as-you-go, very affordable for GPT-3.5-turbo (~$0.001 per recipe)

## Recommendation

Start with **Groq API** as it offers a free tier and is fast. You can always switch to OpenAI later if needed.

