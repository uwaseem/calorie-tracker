import express from "express"
import path from "path"

import { fileURLToPath } from "url"

import trackRoute from "./routes/track.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const APP = express()
APP.use(express.static(path.join(__dirname, "../client")))

APP.get(["/health", "/ping"], (_req, res) => {
  return res
    .status(200).json({
      data: { message: "Welcome to Calorie Tracker!" }
    })
  })

APP.use("/track", trackRoute)

APP.use((_req, res) => {
  return res
    .status(404)
    .json({
      error: {
        code: "ROUTE_NOT_FOUND",
        message: "Route not found"
      }
    })
})