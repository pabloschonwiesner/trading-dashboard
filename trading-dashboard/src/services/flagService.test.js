import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCountryFlag } from './flagService';
import { flagAs93Adapter } from './flagAs93Adapter';
import { flagCdnAdapter } from './flagCdnAdapter';

vi.mock('./flagAs93Adapter', () => ({
  flagAs93Adapter: {
    getFlagUrl: vi.fn()
  }
}));

vi.mock('./flagCdnAdapter', () => ({
  flagCdnAdapter: {
    getFlagUrl: vi.fn()
  }
}));

describe("flagService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return null when currencyCode is empty', () => {
    //ARRANGE AND ACT
    const result = getCountryFlag('');
    
    //ASSERT
    expect(result).toBeNull();
  })
  
  it('should return null when currencyCode is undefined', () => {
    //ARRANGE AND ACT
    const result = getCountryFlag();
    
    //ASSERT
    expect(result).toBeNull();
  })

  it('should return from flagCdnProvider when currencyCode is in the list', () => {
    //ARRANGE
    const currencyCode = 'BAM'
    const expectedUrl = 'https://flagcdn.com/w20/ba.png'
    flagCdnAdapter.getFlagUrl.mockReturnValue(expectedUrl)

    //ACT
    const result = getCountryFlag(currencyCode);
    
    //ASSERT
    expect(flagCdnAdapter.getFlagUrl).toHaveBeenCalledWith(currencyCode)
    expect(flagCdnAdapter.getFlagUrl).toHaveBeenCalledTimes(1)
    expect(flagAs93Adapter.getFlagUrl).not.toHaveBeenCalled()
    expect(result).toBe(expectedUrl)
    expect(result).toContain('http')
  })
  
  it('should return an url string when currencyCode is valid', () => {
    //ARRANGE
    const currencyCode = 'EUR'
    const expectedUrl = 'https://raw.githubusercontent.com/Lissy93/currency-flags/master/assets/flags_svg/eur.svg'
    flagAs93Adapter.getFlagUrl.mockReturnValue(expectedUrl)
    
    //ACT
    const result = getCountryFlag(currencyCode);
    
    //ASSERT
    expect(flagAs93Adapter.getFlagUrl).toHaveBeenCalledWith(currencyCode)
    expect(flagAs93Adapter.getFlagUrl).toHaveBeenCalledTimes(1)
    expect(flagCdnAdapter.getFlagUrl).not.toHaveBeenCalled()
    expect(result).toBe(expectedUrl)
    expect(result).toContain('http')
    expect(result).toContain(currencyCode.toLowerCase());
  })
})