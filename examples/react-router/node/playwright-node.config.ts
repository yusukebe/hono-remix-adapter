import { defineConfig, devices } from '@playwright/test'

const port = 3010

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
    command: 'npm exec tsx ./main.ts',
    port,
    reuseExistingServer: !process.env.CI,
  },
})
