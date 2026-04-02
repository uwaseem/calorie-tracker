import request from "supertest"

import { describe, it, expect } from "vitest"

import { APP } from "../../src/app.js"

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