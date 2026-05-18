import { describe, it, expect, vi } from 'vitest';
import { createLocalStorageCache } from './localStorageCache';

describe("localStorageCache", () => {
  it('should return null when key does not exists', () => {
    //ARRANGE
    const cache = createLocalStorageCache();
    localStorage.getItem.mockReturnValue(null);
    const key = 'test-key';

    //ACT
    const result = cache.get(key);

    //ASSERT
    expect(result).toBeNull();
    expect(localStorage.getItem).toHaveBeenCalledWith(`fx-cache:${key}`)
  })
  it('should return null when item has expired', () => {
    //ARRANGE
    const originalDateNow = Date.now;
    const cache = createLocalStorageCache();
    const key = 'test-key';
    
    Date.now = vi.fn(() => 1000);
    
    const expiredItem = JSON.stringify({
        value: 'test-value',
        expiresAt: 500
    })
    localStorage.getItem.mockReturnValue(expiredItem);
    
    //ACT
    const result = cache.get(key);

    //ASSERT
    expect(result).toBeNull();
    expect(localStorage.removeItem).toHaveBeenCalled()

    Date.now = originalDateNow;
  })
  it('should return value when item exists and ttl is valid', () => {
    //ARRANGE
    const originalDateNow = Date.now;
    const cache = createLocalStorageCache();
    const key = 'test-key';

    Date.now = vi.fn(() => 1000);

    const validItem = JSON.stringify({
        value: 'test-value',
        expiresAt: 2000
    })
    localStorage.getItem.mockReturnValue(validItem);

    //ACT
    const result = cache.get(key);
    
    //ASSERT
    expect(result).toBe('test-value');
    expect(localStorage.removeItem).not.toHaveBeenCalled();

    Date.now = originalDateNow;
})
it('should save item with ttl', () => {
    //ARRANGE
    const originalDateNow = Date.now;
    const cache = createLocalStorageCache();
    const currentTime = 1000;
    const ttl = 5000;
    const key = 'test-key';
    const value = 'test-value';

    Date.now = vi.fn(() => currentTime);
    
    //ACT
    cache.set(key, value, ttl);
    
    //ASSERT
    expect(localStorage.setItem).toHaveBeenCalledWith(`fx-cache:${key}`, JSON.stringify({
        value,
        expiresAt: currentTime + ttl
    }))

    const savedData = JSON.parse(localStorage.setItem.mock.calls[0][1]);
    expect(savedData).toEqual({
        value,
        expiresAt: currentTime + ttl
    })

    Date.now = originalDateNow;
  })
  it('should remove item', () => {
    //ARRANGE
    const cache = createLocalStorageCache();
    const key = 'test-key';

    //ACT
    cache.remove(key);

    //ASSERT
    expect(localStorage.removeItem).toHaveBeenCalledTimes(1)    
    expect(localStorage.removeItem).toHaveBeenCalledWith(`fx-cache:${key}`)
  })
  it('should use custom prefix', () => {
    //ARRANGE
    const prefix = 'my-app'
    const cache = createLocalStorageCache({ prefix });
    const key = 'test-key'; 
    localStorage.getItem.mockReturnValue(null);

    //ACT
    cache.get(key);

    //ASSERT
    expect(localStorage.getItem).toHaveBeenCalledWith(`${prefix}:${key}`)
  })
});