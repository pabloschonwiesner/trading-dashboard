const flagCdnBaseUrl = import.meta.env.VITE_FLAGCDN_URL || 'https://flagcdn.com/32x24'

function mapCurrencyCodeToCountryCode(currencyCode) {
  const currencyToCountryMap = {
    'bam': 'ba',
    'sdg': 'sd',
    'svc': 'sv',
    'szl': 'sz',
    'xau': null,
    'xag': null
  }
  return currencyToCountryMap[currencyCode.toLowerCase()] || currencyCode.toLowerCase()
}

export function createFlagCdnAdapter() {
  return {
    getFlagUrl(currencyCode) {    
      const countryCode = mapCurrencyCodeToCountryCode(currencyCode)
      if (!countryCode) return null
      return `${flagCdnBaseUrl}/${countryCode}.png`
    }
  } 
}

export const flagCdnAdapter = createFlagCdnAdapter()
