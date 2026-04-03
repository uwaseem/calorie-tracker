import { Router } from "express"
import multer from "multer"

import { analyseImageWithLLM } from "../imageAnalyser.js"

const router = Router()
const upload = multer({ storage: multer.memoryStorage() })

router.post("/", upload.single("file"), async (req, res) => {
  const file = req.file

  if (!file) {
    return res
      .status(400)
      .json({ 
        error: {
          code: "NO_FILE_UPLOADED",
          message: "Please upload a file to track calories"
        }
      })
  }

  const isImage = file.mimetype.startsWith("image/")

  if (!isImage) {
    return res
      .status(422)
      .json({ 
        error: {
          code: "INVALID_FILE_TYPE",
          message: "Please upload a valid image file to track calories"
        }
      })
  }

  try {
    const results = await analyseImageWithLLM(file.buffer)
    return res
      .status(200)
      .json({ data: results})

  } catch (error) {
    return res
      .status(500)
      .json({ 
        error: {
          code: "IMAGE_ANALYSIS_FAILED",
          message: "Failed to analyze the image. Please try again later.",
        }
      })
  }
})

export default router