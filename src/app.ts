import express from "express"

import trackRoute from "./routes/track.js"

export const APP = express()
APP.use(express.json())

APP.get(["/", "/health", "/ping"], (_req, res) => {
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