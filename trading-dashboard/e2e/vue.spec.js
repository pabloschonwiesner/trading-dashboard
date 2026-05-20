import { test, expect } from '@playwright/test'

test('should load the application successfully', async ({ page }) => {
  await page.goto('/')
  
  const heading = page.getByRole('heading', { name: /FX Trading Dashboard/i })
  await expect(heading).toBeVisible()
  
  const errors = []
  page.on('pageerror', (error) => {
    errors.push(error.message)
  })
  
  await page.waitForTimeout(1000)
  
  expect(errors.length).toBe(0)
})
