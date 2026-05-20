import { describe, it, expect } from 'vitest'
import { getErrorMessage } from './errorMessages'
import { ApiError, RateLimitError, NetworkError, NotFoundError, ServerError } from '@/errors/ApiError'

describe('getErrorMessage', () => {
  it('should return default error message for null/undefined error', () => {
    const result = getErrorMessage(null)
    
    expect(result).toEqual({
      title: 'Unknown Error',
      message: 'An unexpected error occurred. Please try again.',
      type: 'error',
      canRetry: true
    })
  })

  it('should return default error message for undefined error', () => {
    const result = getErrorMessage(undefined)
    
    expect(result).toEqual({
      title: 'Unknown Error',
      message: 'An unexpected error occurred. Please try again.',
      type: 'error',
      canRetry: true
    })
  })

  describe('RateLimitError', () => {
    it('should return rate limit message without retryAfter', () => {
      const error = new RateLimitError()
      const result = getErrorMessage(error)
      
      expect(result.title).toBe('Too Many Requests')
      expect(result.message).toContain('API rate limit')
      expect(result.message).toContain('5 requests per minute')
      expect(result.message).toContain('Please wait a moment before trying again')
      expect(result.type).toBe('warning')
      expect(result.canRetry).toBe(true)
      expect(result.retryAfter).toBeNull()
    })

    it('should return rate limit message with retryAfter', () => {
      const error = new RateLimitError(60)
      const result = getErrorMessage(error)
      
      expect(result.title).toBe('Too Many Requests')
      expect(result.message).toContain('Please wait 60 seconds before trying again')
      expect(result.type).toBe('warning')
      expect(result.canRetry).toBe(true)
      expect(result.retryAfter).toBe(60)
    })
  })

  describe('NetworkError', () => {
    it('should return network error message with default message', () => {
      const error = new NetworkError()
      const result = getErrorMessage(error)
      
      expect(result.title).toBe('Connection Error')
      expect(result.message).toBe('Network error occurred')
      expect(result.type).toBe('error')
      expect(result.canRetry).toBe(true)
    })

    it('should return network error message with custom message', () => {
      const error = new NetworkError('Custom network error message')
      const result = getErrorMessage(error)
      
      expect(result.title).toBe('Connection Error')
      expect(result.message).toBe('Custom network error message')
      expect(result.type).toBe('error')
      expect(result.canRetry).toBe(true)
    })
  })

  describe('NotFoundError', () => {
    it('should return not found error message', () => {
      const error = new NotFoundError()
      const result = getErrorMessage(error)
      
      expect(result.title).toBe('Data Not Found')
      expect(result.message).toContain('currency data could not be found')
      expect(result.message).toContain('try selecting a different currency pair')
      expect(result.type).toBe('warning')
      expect(result.canRetry).toBe(false)
    })
  })

  describe('ServerError', () => {
    it('should return server error message', () => {
      const error = new ServerError()
      const result = getErrorMessage(error)
      
      expect(result.title).toBe('Server Error')
      expect(result.message).toContain('server is experiencing issues')
      expect(result.message).toContain('try again in a few moments')
      expect(result.type).toBe('error')
      expect(result.canRetry).toBe(true)
    })

    it('should return server error message for 503', () => {
      const error = new ServerError('Service unavailable', 503)
      const result = getErrorMessage(error)
      
      expect(result.title).toBe('Server Error')
      expect(result.type).toBe('error')
      expect(result.canRetry).toBe(true)
    })
  })

  describe('ApiError', () => {
    it('should return generic API error message', () => {
      const error = new ApiError('Bad request', 400)
      const result = getErrorMessage(error)
      
      expect(result.title).toBe('API Error')
      expect(result.message).toBe('Bad request')
      expect(result.type).toBe('error')
      expect(result.canRetry).toBe(true)
    })

    it('should return default message if ApiError has no message', () => {
      const error = new ApiError('', 400)
      const result = getErrorMessage(error)
      
      expect(result.title).toBe('API Error')
      expect(result.message).toBe('An error occurred while fetching data. Please try again.')
      expect(result.type).toBe('error')
      expect(result.canRetry).toBe(true)
    })
  })

  describe('Generic Error', () => {
    it('should handle generic JavaScript Error', () => {
      const error = new Error('Something went wrong')
      const result = getErrorMessage(error)
      
      expect(result.title).toBe('Error')
      expect(result.message).toBe('Something went wrong')
      expect(result.type).toBe('error')
      expect(result.canRetry).toBe(true)
    })

    it('should handle Error with no message', () => {
      const error = new Error()
      const result = getErrorMessage(error)
      
      expect(result.title).toBe('Error')
      expect(result.message).toBe('An unexpected error occurred. Please try again.')
      expect(result.type).toBe('error')
      expect(result.canRetry).toBe(true)
    })
  })

  describe('Unknown error types', () => {
    it('should handle string error', () => {
      const result = getErrorMessage('String error')
      
      expect(result.title).toBe('Unknown Error')
      expect(result.message).toBe('String error')
      expect(result.type).toBe('error')
      expect(result.canRetry).toBe(true)
    })

    it('should handle number error', () => {
      const result = getErrorMessage(404)
      
      expect(result.title).toBe('Unknown Error')
      expect(result.message).toBe('404')
      expect(result.type).toBe('error')
      expect(result.canRetry).toBe(true)
    })

    it('should handle object error', () => {
      const result = getErrorMessage({ code: 'ERR_001' })
      
      expect(result.title).toBe('Unknown Error')
      expect(result.message).toContain('object')
      expect(result.type).toBe('error')
      expect(result.canRetry).toBe(true)
    })
  })
})
