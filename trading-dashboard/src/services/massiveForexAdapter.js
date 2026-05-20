const massiveBaseUrl = import.meta.env.VITE_MASSIVE_API_BASE_URL
const apiKey = import.meta.env.VITE_MASSIVE_API_KEY

export function createMassiveForexAdapter(httpClient) {
  const massiveHeader = {
    'Authorization': `Bearer ${apiKey}`,
    "Accept": "application/json"
  }

  return {

    async getCurrencyPairs() {
      let allResults = []
      let nextUrl = `${massiveBaseUrl}/v3/reference/tickers?market=fx&limit=1000`

      while (nextUrl) {
        const response = await httpClient.get(nextUrl, { headers: massiveHeader })
        allResults = allResults.concat(response.results)
        nextUrl = response.next_url ? `${response.next_url}&limit=1000` : null
      }

      return allResults.map((item) => {
        const cleanSymbol = item.ticker.replace('C:', '')
        const baseCurrency = cleanSymbol.slice(0, 3)
        const quoteCurrency = cleanSymbol.slice(3, 6)

        return {
          symbol: cleanSymbol,
          providerSymbol: item.ticker,
          baseCurrency,
          quoteCurrency,
          exchange: item.market,
          name: item.name,
        }
      })
    },

    async getHistoricalRates({ providerSymbol, from, to, multiplier = 1, timespan = 'day' }) {
      const response = await httpClient.get(
        `${massiveBaseUrl}/v2/aggs/ticker/C:${providerSymbol}/range/${multiplier}/${timespan}/${from}/${to}`,
        { headers: massiveHeader }
      )

      return response.results.map((item) => ({
        timestamp: item.t,
        open: item.o,
        high: item.h,
        low: item.l,
        close: item.c,
      }))
    },

    async getPreviousClose( providerSymbol ) {
      const response = await httpClient.get(
        `${massiveBaseUrl}/v2/aggs/ticker/C:${providerSymbol}/prev`,
        { headers: massiveHeader }
      )

      return response.results.map((item) => ({
        timestamp: item.t,
        open: item.o,
        high: item.h,
        low: item.l,
        close: item.c,
      }))
    },
  }
}