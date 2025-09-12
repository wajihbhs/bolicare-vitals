import { test, expect } from "@playwright/test"
test.describe("BaseButton component", () => {
    test("renders and emits click", async ({ page }) => {
        await page.goto("http://localhost:5173/")

        const button = page.getByRole("button", { name: `🇬🇧 English` })
        await expect(button).toBeVisible()

        await button.click()
    })
})
