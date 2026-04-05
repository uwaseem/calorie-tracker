import request from "supertest"

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"

import { APP } from "../../src/app.js"
import { sendImage } from "../../src/services/gemini.js"
import { getFixturePath, loadTextFixture, loadJSONFixture } from "../utils/fixtures.js"

// Mock the gemini module
vi.mock("../../src/services/gemini.js", () => ({ sendImage: vi.fn() }))

describe("/track", () => {
  describe("when no input file provided", () => {
    it("should return status code 400", async () => {
      const res = await request(APP)
        .post("/track")

      expect(res.status).toBe(400)
    })

    it("should return appropriate error message", async () => {
      const res = await request(APP)
        .post("/track")

      expect(res.body).toEqual({
        error: {
          code: "NO_FILE_UPLOADED",
          message: "Please upload a file to track calories",
          error: "No file found in the request"
        }
      })
    })
  })

  describe("when input file is not an image", () => {
    const filePath = getFixturePath("inputs/test-file.txt")

    it("should return status code 422", async () => {
      const res = await request(APP)
        .post("/track")
        .attach("file", filePath)

      expect(res.status).toBe(422)
    })

    it("should return appropriate error message", async () => {
      const res = await request(APP)
        .post("/track")
        .attach("file", filePath)

      expect(res.body).toEqual({
        error: {
          code: "INVALID_FILE_TYPE",
          message: "Please upload a valid image file to track calories",
          error: "Unsupported file type: text/plain"
        }
      })
    })
  })

  describe("when input file is an image", () => {
    const filePath = getFixturePath("inputs/test-image.jpeg")
    const geminiMockResponse = loadJSONFixture("gemini/fakeValidResponse.json")

    describe("and end-to-end successful flow", () => {
      beforeEach(() => {
        // Arrange the successful Gemini mock response
        vi.mocked(sendImage).mockResolvedValue(JSON.stringify(geminiMockResponse))
      })

      afterEach(() => { vi.clearAllMocks() })

      it("should return status code 200", async () => {
        const res = await request(APP)
          .post("/track")
          .attach("file", filePath)

        expect(res.status).toBe(200)
      })

      it("should return appropriate data", async () => {
        const res = await request(APP)
          .post("/track")
          .attach("file", filePath)

        //TODO: better testing of the response body structure and values 
        expect(res.body.data).toBeDefined()
        expect(Array.isArray(res.body.data.items)).toBe(true)
        expect(typeof res.body.data.calories).toBe("number")
        expect(typeof res.body.data.confidence).toBe("number")
      })
    })

    describe("but error thrown downstream", () => {
      const geminiMockResponse = loadTextFixture("gemini/fakeInvalidResponse.txt")

      beforeEach(() => {
        // Arrange the failed Gemini mock response
        vi.mocked(sendImage).mockResolvedValue(geminiMockResponse)
      })

      afterEach(() => { vi.clearAllMocks() })

      it("should return status code 500", async () => {
        const res = await request(APP)
          .post("/track")
          .attach("file", filePath)

        expect(res.status).toBe(500)
      })

      it("should return appropriate error message", async () => {
        const res = await request(APP)
          .post("/track")
          .attach("file", filePath)

        expect(res.body).toEqual({
          error: {
            code: "IMAGE_ANALYSIS_FAILED",
            message: "Failed to analyze the image. Please try again later.",
            error: "Invalid JSON response from LLM"
          }
        })
      })
    })
  })
})