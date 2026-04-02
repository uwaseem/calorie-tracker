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

  const results = await analyseImageWithLLM(file.buffer)

    return res
      .status(200)
      .json({ data: results})
})

export default router