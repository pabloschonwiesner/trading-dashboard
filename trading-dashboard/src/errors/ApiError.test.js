import { describe, it, expect } from 'vitest'
import { ApiError, RateLimitError, NetworkError, NotFoundError, ServerError } from './ApiError'

describe('ApiError', () => {
  it('should create an ApiError with message and status code', () => {
    const error = new ApiError('Test error', 400)
    
    expect(error).toBeInstanceOf(Error)
    expect(error).toBeInstanceOf(ApiError)
    expect(error.message).toBe('Test error')
    expect(error.statusCode).toBe(400)
    expect(error.name).toBe('ApiError')
    expect(error.originalError).toBeNull()
  })

  it('should store original error if provided', () => {
    const originalError = new Error('Original')
    const error = new ApiError('Wrapped error', 500, originalError)
    
    expect(error.originalError).toBe(originalError)
  })
})

describe('RateLimitError', () => {
  it('should create a RateLimitError with default values', () => {
    const error = new RateLimitError()
    
    expect(error).toBeInstanceOf(ApiError)
    expect(error).toBeInstanceOf(RateLimitError)
    expect(error.message).toBe('Rate limit exceeded')
    expect(error.statusCode).toBe(429)
    expect(error.name).toBe('RateLimitError')
    expect(error.retryAfter).toBeNull()
  })

  it('should store retryAfter value when provided', () => {
    const error = new RateLimitError(60)
    
    expect(error.retryAfter).toBe(60)
  })
})

describe('NetworkError', () => {
  it('should create a NetworkError with default message', () => {
    const error = new NetworkError()
    
    expect(error).toBeInstanceOf(ApiError)
    expect(error).toBeInstanceOf(NetworkError)
    expect(error.message).toBe('Network error occurred')
    expect(error.statusCode).toBe(0)
    expect(error.name).toBe('NetworkError')
  })

  it('should create a NetworkError with custom message', () => {
    const error = new NetworkError('Custom network error')
    
    expect(error.message).toBe('Custom network error')
  })
})

describe('NotFoundError', () => {
  it('should create a NotFoundError with default message', () => {
    const error = new NotFoundError()
    
    expect(error).toBeInstanceOf(ApiError)
    expect(error).toBeInstanceOf(NotFoundError)
    expect(error.message).toBe('Resource not found')
    expect(error.statusCode).toBe(404)
    expect(error.name).toBe('NotFoundError')
  })

  it('should create a NotFoundError with custom message', () => {
    const error = new NotFoundError('Currency pair not found')
    
    expect(error.message).toBe('Currency pair not found')
  })
})

describe('ServerError', () => {
  it('should create a ServerError with default values', () => {
    const error = new ServerError()
    
    expect(error).toBeInstanceOf(ApiError)
    expect(error).toBeInstanceOf(ServerError)
    expect(error.message).toBe('Server error occurred')
    expect(error.statusCode).toBe(500)
    expect(error.name).toBe('ServerError')
  })

  it('should create a ServerError with custom message and status code', () => {
    const error = new ServerError('Internal server error', 503)
    
    expect(error.message).toBe('Internal server error')
    expect(error.statusCode).toBe(503)
  })
})
