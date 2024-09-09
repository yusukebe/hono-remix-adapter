import { expect, test } from '@playwright/test'

test('Should return 200 response', async ({ page }) => {
  const response = await page.goto('/')
  expect(response?.status()).toBe(200)
})
