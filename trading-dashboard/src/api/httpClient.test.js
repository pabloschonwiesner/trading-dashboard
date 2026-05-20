import { describe, it, expect, beforeEach } from 'vitest'
import { httpClient } from './httpClient'
import { RateLimitError, NetworkError, NotFoundError, ServerError, ApiError } from '@/errors/ApiError'


describe('httpClient - GET method', () => {
    beforeEach(() => {
        fetch.mockClear()
    })

    it('should make request and return JSON', async () => {
        //ARRANGE
        const responseData = { name: 'Test', value: 123 };

        fetch.mockResolvedValue({
            ok: true,
            json: async () => responseData,
        });

        //ACT
        const result = await httpClient.get('https://api.example.com/data');

        //ASSERT
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('https://api.example.com/data', { method: 'GET' });
        expect(result).toEqual(responseData);
    })
    it('should make request with undefined params and throw error', async () => {
        //ARRANGE  
        const messageError = 'URL is required';      
        const error = new Error(messageError);

        //ACT AND ASSERT
        await expect(() => httpClient.get())
            .rejects.toThrow(error);
    })
    it('should make request with empty params and throw error', async () => {
        //ARRANGE  
        const messageError = 'URL is required';      
        const error = new Error(messageError);

        //ACT AND ASSERT
        await expect(() => httpClient.get())
            .rejects
            .toThrow(error);
    })
    it('should throw NotFoundError when response status is 404', async () => {
        //ARRANGE
        fetch.mockResolvedValue({
            ok: false,
            status: 404,
            headers: new Map()
        });
        
        //ACT AND ASSERT
        await expect(httpClient.get('https://api.example.com/data'))
            .rejects
            .toThrow(NotFoundError);
        expect(fetch).toHaveBeenCalledOnce();
    })

    it('should throw RateLimitError when response status is 429', async () => {
        //ARRANGE
        const headers = new Map([['Retry-After', '60']]);
        fetch.mockResolvedValue({
            ok: false,
            status: 429,
            headers: {
                get: (key) => headers.get(key)
            }
        });
        
        //ACT AND ASSERT
        try {
            await httpClient.get('https://api.example.com/data');
            expect.fail('Should have thrown RateLimitError');
        } catch (error) {
            expect(error).toBeInstanceOf(RateLimitError);
            expect(error.retryAfter).toBe('60');
        }
        expect(fetch).toHaveBeenCalledOnce();
    })

    it('should throw ServerError when response status is 500', async () => {
        //ARRANGE
        fetch.mockResolvedValue({
            ok: false,
            status: 500,
            headers: new Map()
        });
        
        //ACT AND ASSERT
        await expect(httpClient.get('https://api.example.com/data'))
            .rejects
            .toThrow(ServerError);
        expect(fetch).toHaveBeenCalledOnce();
    })

    it('should throw ApiError for other 4xx errors', async () => {
        //ARRANGE
        fetch.mockResolvedValue({
            ok: false,
            status: 400,
            headers: new Map(),
            json: async () => ({ message: 'Bad request' })
        });
        
        //ACT AND ASSERT
        try {
            await httpClient.get('https://api.example.com/data');
            expect.fail('Should have thrown ApiError');
        } catch (error) {
            expect(error).toBeInstanceOf(ApiError);
            expect(error.message).toBe('Bad request');
            expect(error.statusCode).toBe(400);
        }
        expect(fetch).toHaveBeenCalledOnce();
    })
    it('should throw NetworkError for fetch failures', async () => {
        //ARRANGE
        const networkError = new TypeError('fetch failed');
        fetch.mockRejectedValue(networkError);
        
        //ACT AND ASSERT
        await expect(httpClient.get('https://api.example.com/data'))
            .rejects
            .toThrow(NetworkError);
        expect(fetch).toHaveBeenCalledOnce();
    })

    it('should re-throw custom errors', async () => {
        //ARRANGE
        const customError = new RateLimitError(30);
        fetch.mockRejectedValue(customError);
        
        //ACT AND ASSERT
        try {
            await httpClient.get('https://api.example.com/data');
            expect.fail('Should have thrown RateLimitError');
        } catch (error) {
            expect(error).toBe(customError);
            expect(error.retryAfter).toBe(30);
        }
        expect(fetch).toHaveBeenCalledOnce();
    })

    it('should re-throw non-fetch errors', async () => {
        //ARRANGE
        const genericError = new Error('Some other error');
        fetch.mockRejectedValue(genericError);
        
        //ACT AND ASSERT
        await expect(httpClient.get('https://api.example.com/data'))
            .rejects
            .toThrow('Some other error');
        expect(fetch).toHaveBeenCalledOnce();
    })
})