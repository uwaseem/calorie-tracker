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

// APP.post("/track", upload.single("file"), (req, res) => {
//   const file = req.file

//   if (!file) {
//     return res
//       .status(400)
//       .json({ 
//         error: {
//           code: "NO_FILE_UPLOADED",
//           message: "Please upload a file to track calories"
//         }
//       })
//   }

//   const isImage = file.mimetype.startsWith("image/")

//   if (!isImage) {
//     return res
//       .status(422)
//       .json({ 
//         error: {
//           code: "INVALID_FILE_TYPE",
//           message: "Please upload a valid image file to track calories"
//         }
//       })
//   }

//   return res
//     .status(200)
//     .json({ 
//       data: { 
//         items: ["chicken", "rice", "broccoli"],
//         calories: 600,
//         confidence: CONFIDENCE.LOW
//       }
//     })
// })

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