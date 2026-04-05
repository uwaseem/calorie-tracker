import { GoogleGenerativeAI } from "@google/generative-ai"
import type { Schema, GenerationConfig } from "@google/generative-ai"

import { getEnvValue } from "../config/env.js"

type sendImageParams = {
  image: Buffer,
  prompt: string,
  responseSchema?: Schema
}

const getGeminiAPIKey = () => {
  const GEMINI_API_KEY = getEnvValue("GEMINI_API_KEY")

  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables.")
  }
  return GEMINI_API_KEY
}

const getClient = () => (new GoogleGenerativeAI(getGeminiAPIKey()))

export async function sendImage(params: sendImageParams): Promise<string> {
  const { image, prompt, responseSchema } = params
  const generationConfig: GenerationConfig = {
    temperature: 0.2,
    maxOutputTokens: 1024,
    topP: 0.8,
    topK: 20,
    responseMimeType: "application/json",
    ...responseSchema ? { responseSchema } : {}
  }

  const GGAI = getClient()
	const model = GGAI.getGenerativeModel({
		model: "gemini-2.5-flash",
		generationConfig
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