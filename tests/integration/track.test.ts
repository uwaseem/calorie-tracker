import request from "supertest"
import path from "path"

import { describe, it, expect, vi } from "vitest"

import { APP } from "../../src/app.js"
import { CONFIDENCE } from "../../src/constants/confidence.js"

import * as gemini from "../../src/services/gemini.js"

// Mock the gemini module
vi.mock("../../src/services/gemini.js", () => {
    return { sendImage: vi.fn() }
})

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
                    message: "Please upload a file to track calories"
                }
            })
            
        })
    })

    describe("when input file is not an image", () => {
        const filePath = path.join(__dirname, "../assets/test-file.txt")

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
                    message: "Please upload a valid image file to track calories"
                }
            })
            
        })
    })

    describe("when input file is an image", () => {
        const filePath = path.join(__dirname, "../assets/test-image.jpeg")

        // Arrange the Gemini mock response
        const geminiMockResponse = {
          items: ["chicken", "rice", "broccoli"],
          calories: 600,
          confidence: "low"
        }
        vi.mocked(gemini.sendImage).mockResolvedValue(JSON.stringify(geminiMockResponse))

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

            expect(res.body.data).toBeDefined()
            expect(Array.isArray(res.body.data.items)).toBe(true)
            expect(typeof res.body.data.calories).toBe("number")
            expect(Object.values(CONFIDENCE)).toContain(res.body.data.confidence)
        })
    })
})