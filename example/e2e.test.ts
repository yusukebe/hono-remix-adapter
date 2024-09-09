import { expect, test } from '@playwright/test'

test('Should return 200 response - /', async ({ page }) => {
  const response = await page.goto('/')
  expect(response?.status()).toBe(200)

  const headers = response?.headers() ?? {}
  expect(headers['x-powered-by']).toBe('Remix and Hono')

  const contentH1 = await page.textContent('h1')
  expect(contentH1).toBe('Remix and Hono')

  const contentH2 = await page.textContent('h2')
  expect(contentH2).toBe('Var is My Value')
})

test('Should return 200 response - /api', async ({ page }) => {
  const response = await page.goto('/api')
  expect(response?.status()).toBe(200)
  expect(await response?.json()).toEqual({ message: 'Hello', var: 'My Value' })
})
