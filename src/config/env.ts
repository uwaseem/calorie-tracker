import dotenv from "dotenv"
dotenv.config()

function getEnvValue(key: string): string {
  const value = process.env[key]

  if (!value) {
    throw new Error(`Environment variable ${key} is not defined`)
  }
  return value
}

export const getGeminiKey = () => getEnvValue("GEMINI_API_KEY")