import { flagAs93Adapter } from './flagAs93Adapter'
import { flagCdnAdapter } from './flagCdnAdapter'

const flagAs93Provider = flagAs93Adapter
const flagCdnProvider = flagCdnAdapter

/**
 * @typedef {Object} CountryFlag
 * @property {string} url
 */
export function getCountryFlag(currencyCode) {
  if(!currencyCode || currencyCode === '') return null

  if(['bam', 'sdg', 'svc', 'szl', 'xau', 'xag'].includes(currencyCode.toLowerCase())) {
    return flagCdnProvider.getFlagUrl(currencyCode)
  }

  return flagAs93Provider.getFlagUrl(currencyCode)
}
