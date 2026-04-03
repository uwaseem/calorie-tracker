const image = document.getElementById("image")
const uploadBtn = document.getElementById("uploadBtn")
const results = document.getElementById("results")

let selectedFile = null

image.addEventListener("change", (event) => {
  const files = event.target.files

  if (!files || files.length < 1) {
    return
  }

  selectedFile = files[0]
  console.log("Selected file:", selectedFile)

})

uploadBtn.addEventListener("click", async () => {
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

    const data = await response.json()
    results.textContent = `Upload successful! Server response: ${JSON.stringify(data)}`
  } catch (error) {
    console.error("Error uploading file:", error)
    results.textContent = `Error uploading file: ${error.message}`
  }
})