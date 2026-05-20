import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ErrorDisplay from './ErrorDisplay.vue'
import { RateLimitError, NetworkError, NotFoundError, ServerError, ApiError } from '@/errors/ApiError'

describe('ErrorDisplay', () => {
  it('should render error display with RateLimitError', () => {
    const error = new RateLimitError(60)
    const wrapper = mount(ErrorDisplay, {
      props: { error }
    })

    expect(wrapper.find('.error-display').exists()).toBe(true)
    expect(wrapper.find('.error-display--warning').exists()).toBe(true)
    expect(wrapper.find('.error-display__title').text()).toBe('Too Many Requests')
    expect(wrapper.find('.error-display__message').text()).toContain('API rate limit')
    expect(wrapper.find('.error-display__message').text()).toContain('5 requests per minute')
    expect(wrapper.find('.error-display__retry').exists()).toBe(true)
  })

  it('should render error display with NetworkError', () => {
    const error = new NetworkError()
    const wrapper = mount(ErrorDisplay, {
      props: { error }
    })

    expect(wrapper.find('.error-display').exists()).toBe(true)
    expect(wrapper.find('.error-display--error').exists()).toBe(true)
    expect(wrapper.find('.error-display__title').text()).toBe('Connection Error')
    expect(wrapper.find('.error-display__message').text()).toBe('Network error occurred')
    expect(wrapper.find('.error-display__retry').exists()).toBe(true)
  })

  it('should render error display with NotFoundError', () => {
    const error = new NotFoundError()
    const wrapper = mount(ErrorDisplay, {
      props: { error }
    })

    expect(wrapper.find('.error-display').exists()).toBe(true)
    expect(wrapper.find('.error-display--warning').exists()).toBe(true)
    expect(wrapper.find('.error-display__title').text()).toBe('Data Not Found')
    expect(wrapper.find('.error-display__message').text()).toContain('currency data could not be found')
    expect(wrapper.find('.error-display__retry').exists()).toBe(false)
  })

  it('should render error display with ServerError', () => {
    const error = new ServerError()
    const wrapper = mount(ErrorDisplay, {
      props: { error }
    })

    expect(wrapper.find('.error-display').exists()).toBe(true)
    expect(wrapper.find('.error-display--error').exists()).toBe(true)
    expect(wrapper.find('.error-display__title').text()).toBe('Server Error')
    expect(wrapper.find('.error-display__message').text()).toContain('server is experiencing issues')
    expect(wrapper.find('.error-display__retry').exists()).toBe(true)
  })

  it('should render error display with generic ApiError', () => {
    const error = new ApiError('Custom error message', 400)
    const wrapper = mount(ErrorDisplay, {
      props: { error }
    })

    expect(wrapper.find('.error-display').exists()).toBe(true)
    expect(wrapper.find('.error-display--error').exists()).toBe(true)
    expect(wrapper.find('.error-display__title').text()).toBe('API Error')
    expect(wrapper.find('.error-display__message').text()).toBe('Custom error message')
    expect(wrapper.find('.error-display__retry').exists()).toBe(true)
  })

  it('should render error display with generic Error', () => {
    const error = new Error('Something went wrong')
    const wrapper = mount(ErrorDisplay, {
      props: { error }
    })

    expect(wrapper.find('.error-display').exists()).toBe(true)
    expect(wrapper.find('.error-display--error').exists()).toBe(true)
    expect(wrapper.find('.error-display__title').text()).toBe('Error')
    expect(wrapper.find('.error-display__message').text()).toBe('Something went wrong')
    expect(wrapper.find('.error-display__retry').exists()).toBe(true)
  })

  it('should emit retry event when retry button is clicked', async () => {
    const error = new NetworkError()
    const wrapper = mount(ErrorDisplay, {
      props: { error }
    })

    const retryButton = wrapper.find('.error-display__retry')
    expect(retryButton.exists()).toBe(true)

    await retryButton.trigger('click')

    expect(wrapper.emitted('retry')).toBeTruthy()
    expect(wrapper.emitted('retry')).toHaveLength(1)
  })

  it('should not show retry button when showRetry is false', () => {
    const error = new NetworkError()
    const wrapper = mount(ErrorDisplay, {
      props: { 
        error,
        showRetry: false
      }
    })

    expect(wrapper.find('.error-display__retry').exists()).toBe(false)
  })

  it('should not show retry button when canRetry is false', () => {
    const error = new NotFoundError()
    const wrapper = mount(ErrorDisplay, {
      props: { error }
    })

    expect(wrapper.find('.error-display__retry').exists()).toBe(false)
  })

  it('should have proper ARIA attributes', () => {
    const error = new RateLimitError(60)
    const wrapper = mount(ErrorDisplay, {
      props: { error }
    })

    const errorDisplay = wrapper.find('.error-display')
    expect(errorDisplay.attributes('role')).toBe('alert')
    expect(errorDisplay.attributes('aria-live')).toBe('assertive')
  })

  it('should have aria-label on retry button', () => {
    const error = new RateLimitError(60)
    const wrapper = mount(ErrorDisplay, {
      props: { error }
    })

    const retryButton = wrapper.find('.error-display__retry')
    expect(retryButton.attributes('aria-label')).toContain('Retry')
  })

  it('should hide icon from screen readers', () => {
    const error = new NetworkError()
    const wrapper = mount(ErrorDisplay, {
      props: { error }
    })

    const icon = wrapper.find('.error-display__icon')
    expect(icon.attributes('aria-hidden')).toBe('true')
  })

  it('should display warning icon for warning type errors', () => {
    const error = new RateLimitError()
    const wrapper = mount(ErrorDisplay, {
      props: { error }
    })

    expect(wrapper.find('.error-display--warning').exists()).toBe(true)
    expect(wrapper.find('.error-display__icon').text()).toBe('⚡')
  })

  it('should display error icon for error type errors', () => {
    const error = new NetworkError()
    const wrapper = mount(ErrorDisplay, {
      props: { error }
    })

    expect(wrapper.find('.error-display--error').exists()).toBe(true)
    expect(wrapper.find('.error-display__icon').text()).toBe('⚠️')
  })
})
