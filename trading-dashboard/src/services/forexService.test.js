import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCurrencyPairs, getHistoricalRates, getPreviousClose } from './forexService';
import * as massiveAdapterModule from './massiveForexAdapter';
import * as cacheModule from '@/cache/localStorageCache';

vi.mock('./massiveForexAdapter');
vi.mock('@/cache/localStorageCache');

describe('forexService', () => {
  let mockAdapter;
  let mockCache;

  beforeEach(() => {
    vi.clearAllMocks();

    mockAdapter = {
      getCurrencyPairs: vi.fn(),
      getHistoricalRates: vi.fn(),
      getPreviousClose: vi.fn()
    };

    mockCache = {
      get: vi.fn(),
      set: vi.fn(),
      remove: vi.fn()
    };

    massiveAdapterModule.createMassiveForexAdapter.mockReturnValue(mockAdapter);
    cacheModule.createLocalStorageCache.mockReturnValue(mockCache);
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
    it('should delegate to provider without caching', async () => {
      //ARRANGE
      const ticker = { providerSymbol: 'C:EURUSD' };
      const mockData = [
        { timestamp: 1609459200000, open: 1.22, high: 1.23, low: 1.21, close: 1.225 }
      ];

      mockAdapter.getPreviousClose.mockResolvedValue(mockData);

      //ACT
      const result = await getPreviousClose(ticker);

      //ASSERT
      expect(mockAdapter.getPreviousClose).toHaveBeenCalledWith(ticker);
      expect(result).toEqual(mockData);
      expect(mockCache.get).not.toHaveBeenCalled();
      expect(mockCache.set).not.toHaveBeenCalled();
    });

    it('should propagate errors from provider', async () => {
      //ARRANGE
      const error = new Error('Previous close error');
      mockAdapter.getPreviousClose.mockRejectedValue(error);

      //ACT & ASSERT
      await expect(getPreviousClose({})).rejects.toThrow('Previous close error');
    });
  });
});
