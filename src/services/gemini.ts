import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai"
import type { Schema } from "@google/generative-ai"

import { getEnvValue } from "../config/env.js"

const getGeminiAPIKey = () => {
  const GEMINI_API_KEY = getEnvValue("GEMINI_API_KEY")

  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables.")
  }
  return GEMINI_API_KEY
}

const getClient = () => (new GoogleGenerativeAI(getGeminiAPIKey()))

const responseSchema: Schema = {
	type: SchemaType.OBJECT,
	properties: {
		items: { 
			type: SchemaType.ARRAY,
			items: { type: SchemaType.STRING }
		},
		calories: { type: SchemaType.NUMBER },
		confidence: {
			type: SchemaType.STRING,
			format: "enum",
			enum: ["low", "medium", "high"]
		}
	},
	required: ["items", "calories", "confidence"]
}

export async function sendImage(image: Buffer, prompt: string): Promise<string> {
  const GGAI = getClient()
	const model = GGAI.getGenerativeModel({
		model: "gemini-2.5-flash",
		generationConfig: {
			temperature: 0.2,
			maxOutputTokens: 1024,
			topP: 0.8,
			topK: 20,
			responseMimeType: "application/json",
			responseSchema
		}
	})

  // Enable this function to debug available models for the provided API key
  // diagnostic()

	const result = await model.generateContent([
		{
			inlineData: {
				data: image.toString("base64"),
				mimeType: "image/jpeg"
			},
		},
		prompt
	])

	return result.response.text()
}

/* Enable this function to debug available models for the provided API key
async function diagnostic() {
  try {
    // We use the v1beta endpoint to list models
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${getGeminiAPIKey()}`
    const response = await fetch(url);
    const data = await response.json();
    
    console.log("Available models for your key:");
    if (data.models) {
      data.models.forEach(m => console.log("- " + m.name));
    } else {
      console.log("No models found. Response:", data);
    }
  } catch (e) {
    console.error("Failed to fetch models", e);
  }
} */