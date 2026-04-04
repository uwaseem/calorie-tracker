import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

import { analyseImageWithLLM } from "../../src/imageAnalyser.js"
import { sendImage } from "../../src/services/gemini.js"

// Mock the gemini module
vi.mock("../../src/services/gemini.js", () => ({ sendImage: vi.fn() }))

describe("imageAnalyser", () => {
  describe("when Gemini returns a non-JSON response", () => {
    beforeEach(() => {
      // Arrange the failed Gemini mock response
      const geminiMockResponse = "Items found were chicken, rice, broccoli. Total calories are 600. Confidence is low."
      vi.mocked(sendImage).mockResolvedValue(geminiMockResponse)
    })

    afterEach(() => { vi.clearAllMocks() })

    it("should throw an error", async () => {
      // Arrange the Gemini mock response
      const geminiMockResponse = "Items found were chicken, rice, broccoli. Total calories are 600. Confidence is low."
      vi.mocked(sendImage).mockResolvedValue(geminiMockResponse)

      const fakeImage = Buffer.from("fake-image")
      await expect(analyseImageWithLLM(fakeImage)).rejects.toThrow()
    })
  })

  describe("when Gemini returns a valid JSON response", () => {
    beforeEach(() => {
      // Arrange the successful Gemini mock response
      const geminiMockResponse = {
        items: ["chicken", "rice", "broccoli"],
        calories: 600,
        confidence: "low"
      }
      vi.mocked(sendImage).mockResolvedValue(JSON.stringify(geminiMockResponse))
    })

    afterEach(() => { vi.clearAllMocks() })

    it("should return parsed structured response from Gemini", async () => {
      // Arrange the Gemini mock response
      const geminiMockResponse = {
        items: ["chicken", "rice", "broccoli"],
        calories: 600,
        confidence: "low"
      }
      vi.mocked(sendImage).mockResolvedValue(JSON.stringify(geminiMockResponse))

      const fakeImage = Buffer.from("fake-image")
      const result = await analyseImageWithLLM(fakeImage)

      expect(result).toEqual(geminiMockResponse)
    })
  })  
})