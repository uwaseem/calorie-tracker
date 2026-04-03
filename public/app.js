const image = document.getElementById("image")
const uploadBtn = document.getElementById("uploadBtn")
const results = document.getElementById("results")

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
  document.getElementById("preview").style.display = "none"
  document.getElementById("preview").src = ""
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

    const img = document.getElementById("preview")
    img.src = tempImageURL
    img.style.display = "block"

  } catch (error) {
    console.error("Error uploading file:", error)
    results.textContent = `Error uploading file: ${error.message}`
  }
})