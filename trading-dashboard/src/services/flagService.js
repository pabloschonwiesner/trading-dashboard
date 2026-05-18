import { flagAs93Adapter } from './flagAs93Adapter'

const provider = flagAs93Adapter

/**
 * @typedef {Object} CountryFlag
 * @property {string} url
 */
export function getCountryFlag(currencyCode) {
  if(!currencyCode || currencyCode === '') return null
  return provider.getFlagUrl(currencyCode)
}
