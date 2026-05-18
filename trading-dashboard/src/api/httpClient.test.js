import { describe, it, expect, beforeEach } from 'vitest'
import { httpClient } from './httpClient'


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
    it('should throw error when response.ok is false', async () => {
        //ARRANGE
        const responseData = { name: 'Test', value: 123 };

        fetch.mockResolvedValue({
            ok: false,
            status: 404
        });
        //ACT AND ASSERT
        await expect(httpClient.get('https://api.example.com/data'))
            .rejects
            .toThrow('HTTP error 404');
        expect(fetch).toHaveBeenCalledOnce();
    })
    it('should propagate network errors', async () => {
        //ARRANGE
        const networkError = new Error('Network error');
        fetch.mockRejectedValue(networkError);
        
        //ACT AND ASSERT
        await expect(httpClient.get('https://api.example.com/data'))
            .rejects
            .toThrow('Network error');
        expect(fetch).toHaveBeenCalledOnce();
    })
})