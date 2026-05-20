import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./massiveForexAdapter', () => {
  const mockAdapter = {
    getCurrencyPairs: vi.fn(),
    getHistoricalRates: vi.fn(),
    getPreviousClose: vi.fn()
  };
  
  return {
    createMassiveForexAdapter: vi.fn(() => mockAdapter)
  };
});

vi.mock('@/cache/localStorageCache', () => {
  const mockCache = {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn()
  };
  
  return {
    createLocalStorageCache: vi.fn(() => mockCache)
  };
});

import { getCurrencyPairs, getHistoricalRates, getPreviousClose } from './forexService';
import { createMassiveForexAdapter } from './massiveForexAdapter';
import { createLocalStorageCache } from '@/cache/localStorageCache';

const mockAdapter = createMassiveForexAdapter();
const mockCache = createLocalStorageCache();

describe('forexService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCurrencyPairs', () => {
    it('should return cached data when available', async () => {
      //ARRANGE
      const cachedData = [
        { symbol: 'EURUSD', baseCurrency: 'EUR', quoteCurrency: 'USD' }
      ];
      mockCache.get.mockReturnValue(cachedData);

      //ACT
      const result = await getCurrencyPairs();

      //ASSERT
      expect(mockCache.get).toHaveBeenCalledWith('currency-pairs');
      expect(result).toEqual(cachedData);
      expect(mockAdapter.getCurrencyPairs).not.toHaveBeenCalled();
    });

    it('should fetch from provider when cache is empty', async () => {
      //ARRANGE
      const freshData = [
        { symbol: 'EURUSD', baseCurrency: 'EUR', quoteCurrency: 'USD' },
        { symbol: 'GBPUSD', baseCurrency: 'GBP', quoteCurrency: 'USD' }
      ];
      
      mockCache.get.mockReturnValue(null);
      mockAdapter.getCurrencyPairs.mockResolvedValue(freshData);

      //ACT
      const result = await getCurrencyPairs();

      //ASSERT
      expect(mockCache.get).toHaveBeenCalledWith('currency-pairs');
      expect(mockAdapter.getCurrencyPairs).toHaveBeenCalledTimes(1);
      expect(result).toEqual(freshData);
    });

    it('should cache fetched data with correct TTL', async () => {
      //ARRANGE
      const freshData = [
        { symbol: 'EURUSD', baseCurrency: 'EUR', quoteCurrency: 'USD' }
      ];
      
      mockCache.get.mockReturnValue(null);
      mockAdapter.getCurrencyPairs.mockResolvedValue(freshData);

      //ACT
      await getCurrencyPairs();

      //ASSERT
      expect(mockCache.set).toHaveBeenCalledWith(
        'currency-pairs',
        freshData,
        24 * 60 * 60 * 1000
      );
    });

    it('should propagate errors from provider', async () => {
      //ARRANGE
      const error = new Error('API Error');
      mockCache.get.mockReturnValue(null);
      mockAdapter.getCurrencyPairs.mockRejectedValue(error);

      //ACT & ASSERT
      await expect(getCurrencyPairs()).rejects.toThrow('API Error');
    });
  });

  describe('getHistoricalRates', () => {
    it('should delegate to provider without caching', async () => {
      //ARRANGE
      const params = {
        providerSymbol: 'C:EURUSD',
        from: '2021-01-01',
        to: '2021-01-02'
      };

      const mockData = [
        { timestamp: 1609459200000, open: 1.22, high: 1.23, low: 1.21, close: 1.225 }
      ];
      
      mockCache.get.mockReturnValue(null);

      mockAdapter.getHistoricalRates.mockResolvedValue(mockData);

      //ACT
      const result = await getHistoricalRates(params);

      //ASSERT
      expect(mockAdapter.getHistoricalRates).toHaveBeenCalledWith(params);
      expect(result).toEqual(mockData);
      expect(mockCache.get).not.toHaveBeenCalled();
      expect(mockCache.set).not.toHaveBeenCalled();
    });

    it('should propagate errors from provider', async () => {
      //ARRANGE
      const error = new Error('Historical data error');
      mockAdapter.getHistoricalRates.mockRejectedValue(error);

      //ACT & ASSERT
      await expect(getHistoricalRates({})).rejects.toThrow('Historical data error');
    });
  });

  describe('getPreviousClose', () => {
    it('should return cached data when available', async () => {
      //ARRANGE
      const ticker = 'EURUSD';
      const cachedData = [
        { timestamp: 1609459200000, open: 1.22, high: 1.23, low: 1.21, close: 1.225 }
      ];
      mockCache.get.mockReturnValue(cachedData);

      //ACT
      const result = await getPreviousClose(ticker);

      //ASSERT
      expect(mockCache.get).toHaveBeenCalledWith('previous-close-EURUSD');
      expect(result).toEqual(cachedData);
      expect(mockAdapter.getPreviousClose).not.toHaveBeenCalled();
    });

    it('should fetch from provider and cache when cache is empty', async () => {
      //ARRANGE
      const ticker = 'EURUSD';
      const mockData = [
        { timestamp: 1609459200000, open: 1.22, high: 1.23, low: 1.21, close: 1.225 }
      ];
      
      mockCache.get.mockReturnValue(null);
      mockAdapter.getPreviousClose.mockResolvedValue(mockData);

      //ACT
      const result = await getPreviousClose(ticker);

      //ASSERT
      expect(mockCache.get).toHaveBeenCalledWith('previous-close-EURUSD');
      expect(mockAdapter.getPreviousClose).toHaveBeenCalledWith(ticker);
      expect(mockCache.set).toHaveBeenCalledWith(
        'previous-close-EURUSD',
        mockData,
        expect.any(Number)
      );
      expect(result).toEqual(mockData);
    });

    it('should propagate errors from provider', async () => {
      //ARRANGE
      const error = new Error('Previous close error');
      mockCache.get.mockReturnValue(null);
      mockAdapter.getPreviousClose.mockRejectedValue(error);

      //ACT & ASSERT
      await expect(getPreviousClose('EURUSD')).rejects.toThrow('Previous close error');
    });
  });
});
