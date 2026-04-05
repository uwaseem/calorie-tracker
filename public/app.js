const image = document.getElementById("image")

const uploadBtn = document.getElementById("uploadBtn")
const statusSpinner = document.getElementById("statusSpinner")
const statusText = document.getElementById("statusText")

const results = document.getElementById("results")
const preview = document.getElementById("preview")

let selectedFile = null
let tempImageURL = null

image.addEventListener("change", (event) => {
  const files = event.target.files

  if (!files || files.length < 1) {
    return
  }

  selectedFile = files[0]

  if (tempImageURL) {
    URL.revokeObjectURL(tempImageURL)
  }

  tempImageURL = URL.createObjectURL(selectedFile)
})

uploadBtn.addEventListener("click", async () => {
  uploadBtn.disabled = true
  statusSpinner.classList.remove("hidden")
  statusText.textContent = "Uploading..."

  preview.style.display = "none"
  preview.src = ""
  results.textContent = ""

  if (!selectedFile) {
    results.textContent = "Please upload a file first."
    return
  }

  const formData = new FormData()
  formData.append("file", selectedFile)

  try {
    const response = await fetch("/track", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Upload failed with status ${response.status}`)
    }

    const { data } = await response.json()
    results.textContent = `Upload successful! Server response: ${JSON.stringify(data, null, 2)}`

    preview.src = tempImageURL
    preview.style.display = "block"

  } catch (error) {
    console.error("Error uploading file:", error)
    results.textContent = `Error uploading file: ${error.message}`
  } finally {
    uploadBtn.disabled = false
    statusSpinner.classList.add("hidden")
    statusText.textContent = ""
  }
})