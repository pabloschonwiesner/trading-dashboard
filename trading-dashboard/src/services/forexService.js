import { httpClient } from '@/api/httpClient'
import { createMassiveForexAdapter } from './massiveForexAdapter'
import { createLocalStorageCache } from '@/cache/localStorageCache'

const provider = createMassiveForexAdapter(httpClient)
const cache = createLocalStorageCache({ prefix: 'forex' })
const TTL_HOUR = 60 * 60 * 1000

/**
 * @typedef {Object} CurrencyPair
 * @property {string} symbol
 * @property {string} providerSymbol
 * @property {string} baseCurrency
 * @property {string} quoteCurrency
 * @property {string} exchange
 * @property {string} name
 */
export async function getCurrencyPairs() {
  const cacheKey = 'currency-pairs'
  const cached = cache.get(cacheKey)
  if (cached) {
    return cached
  }
  const response = await provider.getCurrencyPairs()
  cache.set(cacheKey, response, 624 * TTL_HOUR)
  return response
}

/**
 * @typedef {Object} HistoricalRate
 * @property {string} date
 * @property {number} rate
 */
export async function getHistoricalRates(params) {
  return provider.getHistoricalRates(params)
}

/**
 * @typedef {Object} PreviousClose
 * @property {string} date
 * @property {number} rate
 */
export async function getPreviousClose(ticker) {
  return provider.getPreviousClose(ticker)
}
