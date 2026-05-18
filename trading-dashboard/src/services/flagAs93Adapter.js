const flagAs93BaseUrl = import.meta.env.VITE_FLAGCDN_URL || 'https://raw.githubusercontent.com/Lissy93/currency-flags/master/assets/flags_svg'

export function createFlagAs93Adapter() {
  return {
    getFlagUrl(currencyCode) {      
      return `${flagAs93BaseUrl}/${currencyCode.toLowerCase()}.svg`
    }
  }
}

export const flagAs93Adapter = createFlagAs93Adapter()
