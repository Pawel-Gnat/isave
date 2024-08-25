import { defineConfig, devices } from '@playwright/test';

// import dotenv from 'dotenv';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

const BASE_URL = 'http://localhost:3000';
const PROJECT_DIR = './e2e';

export default defineConfig({
  testDir: `${PROJECT_DIR}`,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { outputFolder: `${PROJECT_DIR}/playwright-report` }]],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    actionTimeout: process.env.CI ? 10000 : 5000,
    navigationTimeout: process.env.CI ? 30000 : 15000,
  },
  outputDir: `${PROJECT_DIR}/test-results`,
  expect: {
    timeout: 15000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
