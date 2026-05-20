import { test, expect } from '@playwright/test'

const mockCurrencyPairs = {
  results: [
    { ticker: 'C:EURUSD', name: 'EUR/USD' },
    { ticker: 'C:GBPUSD', name: 'GBP/USD' },
    { ticker: 'C:USDJPY', name: 'USD/JPY' },
    { ticker: 'C:AUDUSD', name: 'AUD/USD' }
  ]
}

const mockHistoricalData = {
  results: [
    { t: Date.now() - 86400000 * 7, o: 1.0800, h: 1.0850, l: 1.0780, c: 1.0820, v: 1000 },
    { t: Date.now() - 86400000 * 6, o: 1.0820, h: 1.0880, l: 1.0810, c: 1.0860, v: 1100 },
    { t: Date.now() - 86400000 * 5, o: 1.0860, h: 1.0900, l: 1.0840, c: 1.0870, v: 1200 },
    { t: Date.now() - 86400000 * 4, o: 1.0870, h: 1.0920, l: 1.0850, c: 1.0900, v: 1300 },
    { t: Date.now() - 86400000 * 3, o: 1.0900, h: 1.0950, l: 1.0880, c: 1.0920, v: 1400 },
    { t: Date.now() - 86400000 * 2, o: 1.0920, h: 1.0960, l: 1.0900, c: 1.0940, v: 1500 },
    { t: Date.now() - 86400000, o: 1.0940, h: 1.0980, l: 1.0920, c: 1.0950, v: 1600 },
    { t: Date.now(), o: 1.0950, h: 1.1000, l: 1.0930, c: 1.0980, v: 1700 }
  ]
}

const mockPreviousClose = {
  results: [
    { t: Date.now() - 86400000, c: 1.0950 }
  ]
}

test.describe('Trading Dashboard - Main flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock currency pairs API
    await page.route('**/v3/reference/tickers*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockCurrencyPairs)
      })
    })

    // Mock historical data API
    await page.route('**/v3/aggregates/ticker/*/range/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockHistoricalData)
      })
    })

    // Mock previous close API
    await page.route('**/v3/aggregates/ticker/*/prev*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockPreviousClose)
      })
    })

    await page.goto('/')
  })

  test('should load the dashboard and display the title', async ({ page }) => {
    const heading = page.getByRole('heading', { name: /FX Trading Dashboard/i })
    
    await expect(heading).toBeVisible()
  })

  test('should load currency pairs from API', async ({ page }) => {
    const loadingMessage = page.getByText(/Loading currency pairs/i)
  
    const currencyPairSelect = page.getByLabel(/Primary Symbol/i)
    
    await expect(currencyPairSelect).toBeVisible()
    
    const options = await currencyPairSelect.locator('option').count()

    expect(options).toBeGreaterThan(1)
  })

  test('should select a currency pair and display its data', async ({ page }) => {
    const currencyPairSelect = page.getByLabel(/Primary Symbol/i)
    await expect(currencyPairSelect).toBeVisible()

    await currencyPairSelect.selectOption({ index: 1 })
    
    const currentPriceLabel = page.getByText(/CURRENT PRICE/i)
    await expect(currentPriceLabel).toBeVisible()
    
    const oneDayTab = page.getByRole('tab', { name: /1D/i })
    await expect(oneDayTab).toBeVisible()

    const chart = page.locator('canvas')
    await expect(chart).toBeVisible()
  })

  test('should change timeframe when clicking timeframe buttons', async ({ page }) => {
    const currencyPairSelect = page.getByLabel(/Primary Symbol/i)
    await expect(currencyPairSelect).toBeVisible()
    await currencyPairSelect.selectOption({ index: 1 })
    
    const oneDayTab = page.getByRole('tab', { name: /1D/i })
    await expect(oneDayTab).toBeVisible()
    
    await expect(oneDayTab).toHaveClass(/active/)
    
    const oneWeekTab = page.getByRole('tab', { name: /1W/i })
    await oneWeekTab.click({ force: true })
    
    await expect(oneWeekTab).toHaveClass(/active/)
    
    await expect(oneDayTab).not.toHaveClass(/active/)
  })

  test('should navigate timeframes with keyboard arrows', async ({ page }) => {
    const currencyPairSelect = page.getByLabel(/Primary Symbol/i)
    await expect(currencyPairSelect).toBeVisible()
    await currencyPairSelect.selectOption({ index: 1 })
    
    const oneDayTab = page.getByRole('tab', { name: /1D/i })
    await expect(oneDayTab).toBeVisible()
    
    await oneDayTab.focus()
    
    await page.keyboard.press('ArrowRight')
    
    const oneWeekTab = page.getByRole('tab', { name: /1W/i })
    await expect(oneWeekTab).toHaveClass(/active/)
  })

  test('should persist selected pair in localStorage', async ({ page }) => {
    const currencyPairSelect = page.getByLabel(/Primary Symbol/i)
    await expect(currencyPairSelect).toBeVisible()
    
    const secondOption = await currencyPairSelect.locator('option').nth(1).textContent()
    
    await currencyPairSelect.selectOption({ index: 1 })
    
    await expect(page.getByText(/CURRENT PRICE/i)).toBeVisible()
    
    await page.reload()
    
    await expect(currencyPairSelect).toBeVisible()
    
    const selectedValue = await currencyPairSelect.evaluate((select) => {
      return select.options[select.selectedIndex].text
    })
    
    expect(selectedValue).toBe(secondOption)
  })

  test('should have working skip to main content link', async ({ page }) => {
    const skipLink = page.getByText(/Skip to main content/i)
    
    await skipLink.focus()
    await expect(skipLink).toBeFocused()
    
    await page.keyboard.press('Enter')
    
    const mainContent = page.locator('#main-content')
    await expect(mainContent).toBeInViewport()
  })

  test('should work correctly on mobile viewport', async ({ page }) => {
    await page.waitForLoadState('networkidle')
    await page.setViewportSize({ width: 375, height: 667 })
    
    await page.reload()
    
    const heading = page.getByRole('heading', { name: /FX Trading Dashboard/i })
    await expect(heading).toBeVisible()
    
    const exchangeSelect = page.getByLabel(/Exchange/i)
    await expect(exchangeSelect).toBeVisible()
    
    const currencyPairSelect = page.getByLabel(/Primary Symbol/i)
    await expect(currencyPairSelect).toBeVisible()
    
    await currencyPairSelect.selectOption({ index: 1 })
    
    const chart = page.locator('canvas')
    await expect(chart).toBeVisible()
    
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth
    })
    
    expect(hasHorizontalScroll).toBe(false)
  })

  test('should display selects side by side on tablet', async ({ page }) => {
    await page.waitForLoadState('networkidle')
    await page.setViewportSize({ width: 768, height: 1024 }) 
    
    await page.reload()
    
    const exchangeSelect = page.getByLabel(/Exchange/i)
    const currencyPairSelect = page.getByLabel(/Primary Symbol/i)
    
    await expect(exchangeSelect).toBeVisible()
    await expect(currencyPairSelect).toBeVisible()
    
    const exchangeBox = await exchangeSelect.boundingBox()
    const pairBox = await currencyPairSelect.boundingBox()

    const yDifference = Math.abs(exchangeBox.y - pairBox.y)
    expect(yDifference).toBeLessThan(50)
  })
})

test.describe('Trading Dashboard - Error handling', () => {
  test('should display error message when API fails', async ({ browser }) => {
    const context = await browser.newContext()
    const page = await context.newPage()
    
    await page.route('**/v3/reference/tickers*', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' })
      })
    })
    
    await page.route('**/v3/aggregates/ticker/*/range/**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockHistoricalData)
      })
    })
    
    await page.route('**/v3/aggregates/ticker/*/prev*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockPreviousClose)
      })
    })
    
    await page.goto('/')
    
    const errorTitle = page.getByText(/Server Error/i)
    await expect(errorTitle).toBeVisible()
    
    const retryButton = page.getByRole('button', { name: /Retry after error/i })
    await expect(retryButton).toBeVisible()
    
    await context.close()
  })
})
