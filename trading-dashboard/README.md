# Trading Dashboard

This application is a trading dashboard that displays real-time market data and allows users to track their trading activities.

The purpose of this application is to show how I use Vue.js and other modern web technologies to build a production-ready application.

## Features

- Historical and current rate for an FX pair
- Exchanges selector
- Currency pair selector
- Time range selector
- Current price for the selected pair
- Difference between starting price and ending price of the current time selection
- Historical close prices on a chart

## Tech Stack and libraries

- Vue 3
- Vite
- Chart.js
- Vitest
- Playwright
- Fetch API requests

## Services

- [https://massive.com](https://massive.com)

Create an account and get an API key. You can use the free tier, which allows you to make 5 API calls per minute.
Authentication is done via a Bearer token in the Authorization header or as a query parameter.

You have to set up the API key in the `.env` file.

```
# VITE_MASSIVE_API_BASE_URL=https://api.massive.com
# VITE_MASSIVE_API_KEY=your-api-key
# VITE_FLAG_AS_93_URL=https://raw.githubusercontent.com/Lissy93/currency-flags/master/assets/flags_svg
# VITE_FLAGCDN_URL=https://flagcdn.com/w20
```


## How it works?

1. The user selects an exchange, a currency pair and a time range.
2. The application fetches the historical data from the Massive API.
3. The application displays the historical data on a chart.
4. The application displays the current price for the selected pair.
5. The application shows the country's currency flag.
6. The application displays the difference between starting price and ending price of the current time selection.
7. The application caches the data in localStorage to avoid fetching the same data multiple times.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
npm run build

# Runs the end-to-end tests
npm run test:e2e
# Runs the tests only on Chromium
npm run test:e2e -- --project=chromium
# Runs the tests of a specific file
npm run test:e2e -- tests/example.spec.ts
# Runs the tests in debug mode
npm run test:e2e -- --debug
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
