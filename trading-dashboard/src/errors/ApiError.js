export class ApiError extends Error {
  constructor(message, statusCode, originalError = null) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.originalError = originalError;
  }
}

export class RateLimitError extends ApiError {
  constructor(retryAfter = null) {
    super('Rate limit exceeded', 429);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

export class NetworkError extends ApiError {
  constructor(message = 'Network error occurred') {
    super(message, 0);
    this.name = 'NetworkError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Resource not found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

export class ServerError extends ApiError {
  constructor(message = 'Server error occurred', statusCode = 500) {
    super(message, statusCode);
    this.name = 'ServerError';
  }
}
