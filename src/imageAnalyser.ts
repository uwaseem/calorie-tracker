import { sendImage } from "./services/gemini.js"

export async function analyseImageWithLLM(image: Buffer) {
  const response = await sendImage(image)

  return JSON.parse(response)
}