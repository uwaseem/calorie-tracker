import { SchemaType } from "@google/generative-ai"
import type { Schema } from "@google/generative-ai"

import { sendImage } from "./services/gemini.js"

const prompt = `
You are an AI system that analyzes food images and estimates calorie content.

Return ONLY valid JSON.
Do NOT include explanations, markdown, or backticks.

Schema:
{
  "items": string[],
  "calories": number,
  "confidence": number,
  "breakdown": [
    {
      "item": string,
      "calories": number
    }
  ]
}

Instructions:
- Identify all visible food items in the image
- If the dish contains multiple components (e.g. rice, meat, sauce), break them down separately
- Estimate calories for each component using realistic, real-world portion sizes
- Use common food knowledge (restaurant portions, typical serving sizes)
- Sum all component calories into totalCalories
- Ensure totalCalories equals the sum of estimatedBreakdown calories

Confidence:
-- Return a number between 0 and 1
-- High confidence (0.8–1.0): clear image, familiar dish, easy portion estimation
-- Medium confidence (0.5–0.8): some uncertainty in ingredients or portion size
-- Low confidence (0.0–0.5): unclear image, multiple possible interpretations

Rules:
- Do not leave any field empty
- Always return a best estimate, even if uncertain
- Do not hallucinate non-visible items unless strongly implied (e.g. oil in fried food)
`
const responseSchema: Schema = {
  type: SchemaType.OBJECT,
    properties: {
      items: { 
        type: SchemaType.ARRAY,
        items: { type: SchemaType.STRING }
      },
      calories: { type: SchemaType.NUMBER },
      confidence: { type: SchemaType.NUMBER },
      breakdown: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            item: { type: SchemaType.STRING },
            calories: { type: SchemaType.NUMBER }
          },
          required: ["item", "calories"]
        }
      }
    },
    required: ["items", "calories", "confidence", "breakdown"]
}

export async function analyseImageWithLLM(image: Buffer) {
  const response = await sendImage({image, prompt, responseSchema})

  try {
    return JSON.parse(response)
  } catch (error) {
    throw new Error("Invalid JSON response from LLM")  
  }
}