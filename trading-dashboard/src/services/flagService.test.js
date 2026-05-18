import { describe, it, expect } from 'vitest';
import { getCountryFlag } from './flagService';

describe("flagService", () => {
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
  
  it('should return an url string when currencyCode is valid', () => {
    //ARRANGE
    const currencyCode = 'EUR'
    
    //ACT
    const result = getCountryFlag(currencyCode);
    
    //ASSERT
    expect(result).toBeTypeOf('string')
    expect(result).toContain('http')
    expect(result).toContain(currencyCode.toLowerCase());
  })
})