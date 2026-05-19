const flagAs93BaseUrl = import.meta.env.VITE_FLAG_AS_93_URL || 'https://raw.githubusercontent.com/Lissy93/currency-flags/master/assets/flags_svg'

export function createFlagAs93Adapter() {
  return {
    getFlagUrl(currencyCode) {   
      if (currencyCode.toLowerCase() === 'cnh') {
        currencyCode = 'cny';
      }  
      return `${flagAs93BaseUrl}/${currencyCode.toLowerCase()}.svg`
    }
  }
}

export const flagAs93Adapter = createFlagAs93Adapter()
