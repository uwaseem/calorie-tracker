import { sendImage } from "./services/gemini.js"

export async function analyseImageWithLLM(image: Buffer) {
  const response = await sendImage(image)

  try {
    return JSON.parse(response)
  } catch (error) {
    throw new Error("Invalid JSON response from LLM")  
  }
}