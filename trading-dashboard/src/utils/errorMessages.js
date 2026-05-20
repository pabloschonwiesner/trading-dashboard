import { RateLimitError, NetworkError, NotFoundError, ServerError, ApiError } from '@/errors/ApiError'

export function getErrorMessage(error) {
  if (!error) {
    return {
      title: 'Unknown Error',
      message: 'An unexpected error occurred. Please try again.',
      type: 'error',
      canRetry: true
    }
  }

  if (error instanceof RateLimitError) {
    const retryMessage = error.retryAfter 
      ? `Please wait ${error.retryAfter} seconds before trying again.`
      : 'Please wait a moment before trying again.'
    
    return {
      title: 'Too Many Requests',
      message: `We've reached the API rate limit (5 requests per minute). ${retryMessage}`,
      type: 'warning',
      canRetry: true,
      retryAfter: error.retryAfter
    }
  }

  if (error instanceof NetworkError) {
    return {
      title: 'Connection Error',
      message: error.message || 'Unable to connect to the server. Please check your internet connection and try again.',
      type: 'error',
      canRetry: true
    }
  }

  if (error instanceof NotFoundError) {
    return {
      title: 'Data Not Found',
      message: 'The requested currency data could not be found. Please try selecting a different currency pair.',
      type: 'warning',
      canRetry: false
    }
  }

  if (error instanceof ServerError) {
    return {
      title: 'Server Error',
      message: 'The server is experiencing issues. Please try again in a few moments.',
      type: 'error',
      canRetry: true
    }
  }
  
  if (error instanceof ApiError) {
    return {
      title: 'API Error',
      message: error.message || 'An error occurred while fetching data. Please try again.',
      type: 'error',
      canRetry: true
    }
  }

  if (error instanceof Error) {
    return {
      title: 'Error',
      message: error.message || 'An unexpected error occurred. Please try again.',
      type: 'error',
      canRetry: true
    }
  }

  return {
    title: 'Unknown Error',
    message: String(error) || 'An unexpected error occurred. Please try again.',
    type: 'error',
    canRetry: true
  }
}
