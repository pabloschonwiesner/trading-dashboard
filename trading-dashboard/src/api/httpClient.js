import { ApiError, RateLimitError, NetworkError, NotFoundError, ServerError } from '@/errors/ApiError'

async function request(url, options = {}) {
  if(!url || url === '') {
    throw new Error('URL is required')
  }

  try {
    const response = await fetch(url, options)

    if (!response.ok) {
      if (response.status === 429) {
        const retryAfter = response.headers.get('Retry-After')
        throw new RateLimitError(retryAfter)
      }

      if (response.status === 404) {
        throw new NotFoundError('The requested resource was not found')
      }

      if (response.status >= 500) {
        throw new ServerError(`Server error: ${response.status}`, response.status)
      }

      if (response.status >= 400) {
        const errorData = await response.json().catch(() => ({}))
        throw new ApiError(
          errorData.message || `Request failed with status ${response.status}`,
          response.status
        )
      }

      throw new ApiError(`HTTP error ${response.status}`, response.status)
    }

    return response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new NetworkError('Unable to connect to the server. Please check your internet connection.')
    }

    throw error
  }
}

export const httpClient = {
  get(url, options = {}) {
    return request(url, {
      ...options,
      method: 'GET',
    })
  },
}