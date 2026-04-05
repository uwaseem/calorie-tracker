import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

import { analyseImageWithLLM } from "../../src/imageAnalyser.js"
import { sendImage } from "../../src/services/gemini.js"
import { loadTextFixture, loadJSONFixture } from "../utils/fixtures.js"

// Mock the gemini module
vi.mock("../../src/services/gemini.js", () => ({ sendImage: vi.fn() }))

const fakeImage = Buffer.from("fake-image")

describe("imageAnalyser", () => {
  describe("when Gemini returns a non-JSON response", () => {
    const geminiMockResponse = loadTextFixture("gemini/fakeInvalidResponse.txt")

    beforeEach(() => {
      // Arrange the failed Gemini mock response  
      vi.mocked(sendImage).mockResolvedValue(geminiMockResponse)
    })

    afterEach(() => { vi.clearAllMocks() })

    it("should throw an error", async () => {
      await expect(analyseImageWithLLM(fakeImage)).rejects.toThrow()
    })
  })

  describe("when Gemini returns a valid JSON response", () => {
    const geminiMockResponse = loadJSONFixture("gemini/fakeValidResponse.json")
    
    beforeEach(() => {
      // Arrange the successful Gemini mock response
      vi.mocked(sendImage).mockResolvedValue(JSON.stringify(geminiMockResponse))
    })

    afterEach(() => { vi.clearAllMocks() })

    it("should return parsed structured response from Gemini", async () => {
      const result = await analyseImageWithLLM(fakeImage)

      expect(result).toEqual(geminiMockResponse)
    })
  })  
})