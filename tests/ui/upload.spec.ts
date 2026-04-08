import { test, expect } from '@playwright/test'

test("user upload image", async ({ page }) => {
  // Mock API Call — 
  let resolveRoute: () => void

  await page.route("**/track", async (route) => {
    await new Promise<void>(resolve => { resolveRoute = resolve })
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        "items": ["rice", "chicken breast", "egg"],
        "calories": 630,
        "confidence": 0.92,
        "breakdown": [
          {
            "item": "rice",
            "calories": 300
          },
          {
            "item": "chicken breast",
            "calories": 250
          },
          {
            "item": "egg",
            "calories": 80
          }
        ]
      })
    })
  })
  
  // Visit HTML Page
  await page.goto("/")

  // Initialise HTLM Elements
  const image = page.locator("#image")
  const uploadBtn = page.locator("#uploadBtn")
  const statusSpinner = page.locator("#statusSpinner")
  const statusText = page.locator("#statusText")
  const results = page.locator("#results")
  const preview = page.locator("#preview")

  // Select Image to Upload
  await image.setInputFiles({
    name: "test.png",
    mimeType: "image/png",
    buffer: Buffer.from("fake-image")
  })

  // Click Upload Button
  await page.click("#uploadBtn")

  // Assert Loading States While Mock is Paused
  await expect(uploadBtn).toBeDisabled()
  await expect(statusSpinner).toBeVisible()
  await expect(statusText).toHaveText("Uploading...")

  await expect(preview).toHaveCSS("display", "none")
  await expect(results).toBeEmpty()

  // Release the Mock Response
  resolveRoute!()

  // Assert Success State
  await expect(results).toContainText("Upload successful!")

  await expect(preview).toBeVisible();
  await expect(preview).toHaveAttribute("src", /.+/)
  
  // Assert Finally State
  await expect(uploadBtn).toBeEnabled()
  await expect(statusSpinner).toBeHidden()
  await expect(statusText).toHaveText("")
})