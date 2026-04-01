import request from "supertest"
import path from "path"

import { describe, it, expect } from "vitest"

import { APP } from "../../src/app.js"
import { CONFIDENCE } from "../../src/constants/confidence.js"

const message = "Welcome to Calorie Tracker!"

describe("/", () => {
    it("should return status code 200", async () => {
        const res = await request(APP).get("/")

        expect(res.status).toBe(200)
    })

    it("should return message 'Welcome to Calorie Tracker'", async () => {
        const res = await request(APP).get("/")

        expect(res.body).toEqual({
            data: { message }
        })
    })
})

describe("/health", () => {
    it("should return status code 200", async () => {
        const res = await request(APP).get("/health")

        expect(res.status).toBe(200)
    })

    it("should return message 'Welcome to Calorie Tracker'", async () => {
        const res = await request(APP).get("/health")

        expect(res.body).toEqual({
            data: { message }
        })
    })
})

describe("/ping", () => {
    it("should return status code 200", async () => {
        const res = await request(APP).get("/ping")

        expect(res.status).toBe(200)
    })

    it("should return message 'Welcome to Calorie Tracker'", async () => {
        const res = await request(APP).get("/ping")

        expect(res.body).toEqual({
            data: { message }
        })
    })
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

describe("/unknown-route", () => {
    it("should return status code 404", async () => {
        const res = await request(APP).get("/unknown-route")

        expect(res.status).toBe(404)
    })

    it("should return appropiate error message", async () => {
        const res = await request(APP).get("/unknown-route")

        expect(res.body).toEqual({
            error: {
                code: "ROUTE_NOT_FOUND",
                message: "Route not found"
            }
        })
    })
})