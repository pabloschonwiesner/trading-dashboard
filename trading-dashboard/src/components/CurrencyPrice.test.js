import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CurrencyPrice from './CurrencyPrice.vue'

describe('CurrencyPrice', () => {
  it('should render with required props', () => {
    const wrapper = mount(CurrencyPrice, {
      props: {
        currentPrice: 1.2345,
        difference: 0.0123
      }
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('should display current price', () => {
    const wrapper = mount(CurrencyPrice, {
      props: {
        currentPrice: 1.234567,
        difference: 0
      }
    })
    const priceElement = wrapper.find('[aria-labelledby="price-label"]')
    
    expect(priceElement.text()).toBe('1.234567')
  })

  it('should calculate and display percentage correctly', () => {
    const wrapper = mount(CurrencyPrice, {
      props: {
        currentPrice: 100,
        difference: 5 
      }
    })

    const differenceElement = wrapper.find('.timeframe-difference')
    
    expect(differenceElement.text()).toContain('5.00%')
  })

  it('should show up arrow when difference is positive', () => {
    const wrapper = mount(CurrencyPrice, {
      props: {
        currentPrice: 1.2345,
        difference: 0.0123 
      }
    })

    const arrow = wrapper.find('.arrow')
    
    expect(arrow.text()).toBe('▲')
  })

  it('should show down arrow when difference is negative', () => {
    const wrapper = mount(CurrencyPrice, {
      props: {
        currentPrice: 1.2345,
        difference: -0.0123 
      }
    })

    const arrow = wrapper.find('.arrow')
    
    expect(arrow.text()).toBe('▼')
  })

  it('should show equal sign when difference is zero', () => {
    const wrapper = mount(CurrencyPrice, {
      props: {
        currentPrice: 1.2345,
        difference: 0  
      }
    })

    const arrow = wrapper.find('.arrow')
    
    expect(arrow.text()).toBe('=')
  })

  it('should apply "timeframe-difference-up" class when difference is positive', () => {
    const wrapper = mount(CurrencyPrice, {
      props: {
        currentPrice: 1.2345,
        difference: 0.0123
      }
    })

    const differenceElement = wrapper.find('.timeframe-difference')
    
    expect(differenceElement.classes()).toContain('timeframe-difference-up')
    expect(differenceElement.classes()).not.toContain('timeframe-difference-down')
  })

  it('should apply "timeframe-difference-down" class when difference is negative', () => {
    const wrapper = mount(CurrencyPrice, {
      props: {
        currentPrice: 1.2345,
        difference: -0.0123
      }
    })

    const differenceElement = wrapper.find('.timeframe-difference')
    
    expect(differenceElement.classes()).toContain('timeframe-difference-down')
    expect(differenceElement.classes()).not.toContain('timeframe-difference-up')
  })

  it('should not apply up or down class when difference is zero', () => {
    const wrapper = mount(CurrencyPrice, {
      props: {
        currentPrice: 1.2345,
        difference: 0
      }
    })

    const differenceElement = wrapper.find('.timeframe-difference')
    
    expect(differenceElement.classes()).not.toContain('timeframe-difference-up')
    expect(differenceElement.classes()).not.toContain('timeframe-difference-down')
  })

  it('should format difference with 6 decimal places', () => {
    const wrapper = mount(CurrencyPrice, {
      props: {
        currentPrice: 1.234567,
        difference: 0.123456789 
      }
    })

    const differenceElement = wrapper.find('.timeframe-difference')
    
    expect(differenceElement.text()).toContain('0.123457')
  })

  it('should handle negative differences correctly', () => {
    const wrapper = mount(CurrencyPrice, {
      props: {
        currentPrice: 1.2345,
        difference: -0.056789
      }
    })

    const differenceElement = wrapper.find('.timeframe-difference')
    
    expect(differenceElement.text()).toContain('-0.056789')
  })

  it('should have screen reader text for arrow symbols', () => {
    const wrapper = mount(CurrencyPrice, {
      props: {
        currentPrice: 1.2345,
        difference: 0.0123
      }
    })

    const srText = wrapper.find('.sr-only')
    
    expect(srText.text()).toBe('Increased')
  })

  it('should show "Decreased" for negative difference', () => {
    const wrapper = mount(CurrencyPrice, {
      props: {
        currentPrice: 1.2345,
        difference: -0.0123
      }
    })

    const srText = wrapper.find('.sr-only')
    
    expect(srText.text()).toBe('Decreased')
  })

  it('should show "No change" for zero difference', () => {
    const wrapper = mount(CurrencyPrice, {
      props: {
        currentPrice: 1.2345,
        difference: 0
      }
    })

    const srText = wrapper.find('.sr-only')
    
    expect(srText.text()).toBe('No change')
  })

  it('should have descriptive aria-label for price change', () => {
    const wrapper = mount(CurrencyPrice, {
      props: {
        currentPrice: 100,
        difference: 5
      }
    })

    const differenceElement = wrapper.find('.timeframe-difference')
    const ariaLabel = differenceElement.attributes('aria-label')

    expect(ariaLabel).toContain('increased')
    expect(ariaLabel).toContain('5.000000')
    expect(ariaLabel).toContain('5.00%')
  })

  it('should handle very small differences', () => {
    const wrapper = mount(CurrencyPrice, {
      props: {
        currentPrice: 1.234567,
        difference: 0.000001 
      }
    })

    const differenceElement = wrapper.find('.timeframe-difference')
    
    expect(differenceElement.text()).toContain('0.000001')
  })

  it('should handle large differences', () => {
    const wrapper = mount(CurrencyPrice, {
      props: {
        currentPrice: 1000,
        difference: 123.456789
      }
    })

    const differenceElement = wrapper.find('.timeframe-difference')
    
    expect(differenceElement.text()).toContain('123.456789')
  })

  it('should calculate percentage correctly for various scenarios', () => {
    const wrapper1 = mount(CurrencyPrice, {
      props: {
        currentPrice: 110,
        difference: 10
      }
    })
    expect(wrapper1.find('.timeframe-difference').text()).toContain('9.09%')

    const wrapper2 = mount(CurrencyPrice, {
      props: {
        currentPrice: 100,
        difference: -50
      }
    })
    expect(wrapper2.find('.timeframe-difference').text()).toContain('50.00%')

    const wrapper3 = mount(CurrencyPrice, {
      props: {
        currentPrice: 100,
        difference: 0
      }
    })
    expect(wrapper3.find('.timeframe-difference').text()).toContain('0.00%')
  })
})
