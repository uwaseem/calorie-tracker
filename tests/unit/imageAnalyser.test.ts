import { describe, it, expect, vi } from "vitest"

import { analyseImageWithLLM } from "../../src/imageAnalyser.js"
import * as gemini from "../../src/services/gemini.js"

// Mock the gemini module
vi.mock("../../src/services/gemini.js", () => {
    return { sendImage: vi.fn() }
})

describe("imageAnalyser", () => {
    it("should return parsed structured response from Gemini", async () => {
        // Arrange the Gemini mock response
        const geminiMockResponse = {
            items: ["chicken", "rice", "broccoli"],
            calories: 600,
            confidence: "low"
        }
        vi.mocked(gemini.sendImage).mockResolvedValue(JSON.stringify(geminiMockResponse))

        const fakeImage = Buffer.from("fake-image")

        const result = await analyseImageWithLLM(fakeImage)

        expect(result).toEqual(geminiMockResponse)
    })
})