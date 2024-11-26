import { defineConfig, devices } from '@playwright/test'

const port = 6173

export default defineConfig({
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  use: {
    baseURL: `http://localhost:${port.toString()}`,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      timeout: 5000,
      retries: 2,
    },
  ],
  webServer: {
    command: `npm exec vite -- --port ${port.toString()} -c ./vite.config.ts`,
    port,
    reuseExistingServer: !process.env.CI,
  },
})
