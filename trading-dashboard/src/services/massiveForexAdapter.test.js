import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMassiveForexAdapter } from './massiveForexAdapter';

describe('massiveForexAdapter', () => {
  let mockHttpClient;
  let adapter;

  beforeEach(() => {
    mockHttpClient = {
      get: vi.fn()
    };
    adapter = createMassiveForexAdapter(mockHttpClient);
  });

  describe('getCurrencyPairs', () => {
    it('should fetch single page when no next_url', async () => {
      //ARRANGE
      const mockResponse = {
        results: [
          {
            ticker: 'C:EURUSD',
            name: 'Euro / US Dollar',
            market: 'fx'
          },
          {
            ticker: 'C:GBPUSD',
            name: 'British Pound / US Dollar',
            market: 'fx'
          }
        ],
        next_url: null
      };

      mockHttpClient.get.mockResolvedValue(mockResponse);

      //ACT
      const result = await adapter.getCurrencyPairs();

      //ASSERT
      expect(mockHttpClient.get).toHaveBeenCalledTimes(1);
      expect(mockHttpClient.get).toHaveBeenCalledWith(
        expect.stringContaining('/v3/reference/tickers?market=fx&limit=1000'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': expect.stringContaining('Bearer')
          })
        })
      );
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        symbol: 'EURUSD',
        providerSymbol: 'C:EURUSD',
        baseCurrency: 'EUR',
        quoteCurrency: 'USD',
        exchange: 'fx',
        name: 'Euro / US Dollar'
      });
    });

    it('should fetch multiple pages using while loop', async () => {
      //ARRANGE
      const firstPageResponse = {
        results: [
          { ticker: 'C:EURUSD', name: 'Euro / US Dollar', market: 'fx' }
        ],
        next_url: 'https://api.example.com/page2'
      };

      const secondPageResponse = {
        results: [
          { ticker: 'C:GBPUSD', name: 'British Pound / US Dollar', market: 'fx' }
        ],
        next_url: 'https://api.example.com/page3'
      };

      const thirdPageResponse = {
        results: [
          { ticker: 'C:USDJPY', name: 'US Dollar / Japanese Yen', market: 'fx' }
        ],
        next_url: null
      };

      mockHttpClient.get
        .mockResolvedValueOnce(firstPageResponse)
        .mockResolvedValueOnce(secondPageResponse)
        .mockResolvedValueOnce(thirdPageResponse);

      //ACT
      const result = await adapter.getCurrencyPairs();

      //ASSERT
      expect(mockHttpClient.get).toHaveBeenCalledTimes(3);
      expect(result).toHaveLength(3);
      expect(result[0].symbol).toBe('EURUSD');
      expect(result[1].symbol).toBe('GBPUSD');
      expect(result[2].symbol).toBe('USDJPY');
    });

    it('should append limit=1000 to next_url', async () => {
      //ARRANGE
      const firstPageResponse = {
        results: [
          { ticker: 'C:EURUSD', name: 'Euro / US Dollar', market: 'fx' }
        ],
        next_url: 'https://api.example.com/page2?cursor=abc'
      };

      const secondPageResponse = {
        results: [
          { ticker: 'C:GBPUSD', name: 'British Pound / US Dollar', market: 'fx' }
        ],
        next_url: null
      };

      mockHttpClient.get
        .mockResolvedValueOnce(firstPageResponse)
        .mockResolvedValueOnce(secondPageResponse);

      //ACT
      await adapter.getCurrencyPairs();

      //ASSERT
      expect(mockHttpClient.get).toHaveBeenNthCalledWith(
        2,
        'https://api.example.com/page2?cursor=abc&limit=1000',
        expect.any(Object)
      );
    });

    it('should transform ticker data correctly', async () => {
      //ARRANGE
      const mockResponse = {
        results: [
          {
            ticker: 'C:EURUSD',
            name: 'Euro / US Dollar',
            market: 'fx'
          }
        ],
        next_url: null
      };

      mockHttpClient.get.mockResolvedValue(mockResponse);

      //ACT
      const result = await adapter.getCurrencyPairs();

      //ASSERT
      expect(result[0]).toEqual({
        symbol: 'EURUSD',
        providerSymbol: 'C:EURUSD',
        baseCurrency: 'EUR',
        quoteCurrency: 'USD',
        exchange: 'fx',
        name: 'Euro / US Dollar'
      });
    });

    it('should handle empty results', async () => {
      //ARRANGE
      const mockResponse = {
        results: [],
        next_url: null
      };

      mockHttpClient.get.mockResolvedValue(mockResponse);

      //ACT
      const result = await adapter.getCurrencyPairs();

      //ASSERT
      expect(result).toEqual([]);
    });
  });

  describe('getHistoricalRates', () => {
    it('should fetch historical rates with correct parameters', async () => {
      //ARRANGE
      const mockResponse = {
        results: [
          { t: 1609459200000, o: 1.22, h: 1.23, l: 1.21, c: 1.225 },
          { t: 1609545600000, o: 1.225, h: 1.24, l: 1.22, c: 1.23 }
        ]
      };

      mockHttpClient.get.mockResolvedValue(mockResponse);

      const params = {
        providerSymbol: 'EURUSD',
        from: '2021-01-01',
        to: '2021-01-02',
        multiplier: 1,
        timespan: 'day'
      };

      //ACT
      const result = await adapter.getHistoricalRates(params);

      //ASSERT
      expect(mockHttpClient.get).toHaveBeenCalledWith(
        expect.stringContaining('/v2/aggs/ticker/C:EURUSD/range/1/day/2021-01-01/2021-01-02'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': expect.stringContaining('Bearer')
          })
        })
      );
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        timestamp: 1609459200000,
        open: 1.22,
        high: 1.23,
        low: 1.21,
        close: 1.225
      });
    });

    it('should use default multiplier and timespan', async () => {
      //ARRANGE
      const mockResponse = { results: [] };
      mockHttpClient.get.mockResolvedValue(mockResponse);

      const params = {
        providerSymbol: 'C:EURUSD',
        from: '2021-01-01',
        to: '2021-01-02'
      };

      //ACT
      await adapter.getHistoricalRates(params);

      //ASSERT
      expect(mockHttpClient.get).toHaveBeenCalledWith(
        expect.stringContaining('/range/1/day/'),
        expect.any(Object)
      );
    });
  });

  describe('getPreviousClose', () => {
    it('should fetch previous close data', async () => {
      //ARRANGE
      const mockResponse = {
        results: [
          { t: 1609459200000, o: 1.22, h: 1.23, l: 1.21, c: 1.225 }
        ]
      };

      mockHttpClient.get.mockResolvedValue(mockResponse);

      //ACT
      const result = await adapter.getPreviousClose('EURUSD');

      //ASSERT
      expect(mockHttpClient.get).toHaveBeenCalledWith(
        expect.stringContaining('/v2/aggs/ticker/C:EURUSD/prev'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': expect.stringContaining('Bearer')
          })
        })
      );
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        timestamp: 1609459200000,
        open: 1.22,
        high: 1.23,
        low: 1.21,
        close: 1.225
      });
    });
  });
});
