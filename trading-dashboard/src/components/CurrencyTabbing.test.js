import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CurrencyTabbing from './CurrencyTabbing.vue'

describe('CurrencyTabbing', () => {
  const timeframes = [
    { multiplier: 1, timespan: 'day', label: '1D' },
    { multiplier: 1, timespan: 'week', label: '1W' },
    { multiplier: 1, timespan: 'month', label: '1M' },
    { multiplier: 3, timespan: 'month', label: '3M' }
  ]

  it('should render with required props', () => {
    const wrapper = mount(CurrencyTabbing, {
      props: {
        modelValue: timeframes[0],
        timeframes
      }
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('should render all timeframe buttons', () => {
    const wrapper = mount(CurrencyTabbing, {
      props: {
        modelValue: timeframes[0],
        timeframes
      }
    })

    const buttons = wrapper.findAll('button')
    
    expect(buttons).toHaveLength(timeframes.length)
  })

  it('should display correct labels for each timeframe', () => {
    const wrapper = mount(CurrencyTabbing, {
      props: {
        modelValue: timeframes[0],
        timeframes
      }
    })

    const buttons = wrapper.findAll('button')
    
    buttons.forEach((button, index) => {
      expect(button.text()).toBe(timeframes[index].label)
    })
  })

  it('should apply "active" class to selected timeframe', () => {
    const wrapper = mount(CurrencyTabbing, {
      props: {
        modelValue: timeframes[1], 
        timeframes
      }
    })

    const buttons = wrapper.findAll('button')
    
    expect(buttons[0].classes()).not.toContain('active')
    expect(buttons[1].classes()).toContain('active')
    expect(buttons[2].classes()).not.toContain('active')
  })

  it('should emit update:modelValue when button is clicked', async () => {
    const wrapper = mount(CurrencyTabbing, {
      props: {
        modelValue: timeframes[0],
        timeframes
      }
    })

    const buttons = wrapper.findAll('button')
    
    await buttons[2].trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([timeframes[2]])
  })

  it('should navigate to next timeframe with ArrowRight', async () => {
    const wrapper = mount(CurrencyTabbing, {
      props: {
        modelValue: timeframes[0], 
        timeframes
      }
    })

    const buttons = wrapper.findAll('button')
    
    await buttons[0].trigger('keydown', { key: 'ArrowRight' })

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([timeframes[1]])
  })

  it('should navigate to previous timeframe with ArrowLeft', async () => {
    const wrapper = mount(CurrencyTabbing, {
      props: {
        modelValue: timeframes[2],
        timeframes
      }
    })

    const buttons = wrapper.findAll('button')
    
    await buttons[2].trigger('keydown', { key: 'ArrowLeft' })

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([timeframes[1]])
  })

  it('should wrap to first timeframe when pressing ArrowRight on last', async () => {
    const wrapper = mount(CurrencyTabbing, {
      props: {
        modelValue: timeframes[3], 
        timeframes
      }
    })

    const buttons = wrapper.findAll('button')
    
    await buttons[3].trigger('keydown', { key: 'ArrowRight' })

    expect(wrapper.emitted('update:modelValue')[0]).toEqual([timeframes[0]])
  })

  it('should wrap to last timeframe when pressing ArrowLeft on first', async () => {
    const wrapper = mount(CurrencyTabbing, {
      props: {
        modelValue: timeframes[0],
        timeframes
      }
    })

    const buttons = wrapper.findAll('button')
    
    await buttons[0].trigger('keydown', { key: 'ArrowLeft' })

    expect(wrapper.emitted('update:modelValue')[0]).toEqual([timeframes[3]])
  })

  it('should navigate to first timeframe with Home key', async () => {
    const wrapper = mount(CurrencyTabbing, {
      props: {
        modelValue: timeframes[2], 
        timeframes
      }
    })

    const buttons = wrapper.findAll('button')
    
    await buttons[2].trigger('keydown', { key: 'Home' })

    expect(wrapper.emitted('update:modelValue')[0]).toEqual([timeframes[0]])
  })

  it('should navigate to last timeframe with End key', async () => {
    const wrapper = mount(CurrencyTabbing, {
      props: {
        modelValue: timeframes[0], 
        timeframes
      }
    })

    const buttons = wrapper.findAll('button')
    
    await buttons[0].trigger('keydown', { key: 'End' })

    expect(wrapper.emitted('update:modelValue')[0]).toEqual([timeframes[3]])
  })

  it('should prevent default behavior for arrow keys', async () => {
    const wrapper = mount(CurrencyTabbing, {
      props: {
        modelValue: timeframes[0],
        timeframes
      }
    })

    const buttons = wrapper.findAll('button')
    
    const event = {
      key: 'ArrowRight',
      preventDefault: vi.fn() 
    }
    
    await buttons[0].trigger('keydown', event)

    expect(event.preventDefault).toHaveBeenCalled()
  })

  it('should not emit event for unhandled keys', async () => {
    const wrapper = mount(CurrencyTabbing, {
      props: {
        modelValue: timeframes[0],
        timeframes
      }
    })

    const buttons = wrapper.findAll('button')
    
    await buttons[0].trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('should set aria-selected="true" only on active tab', () => {
    const wrapper = mount(CurrencyTabbing, {
      props: {
        modelValue: timeframes[1], 
        timeframes
      }
    })

    const buttons = wrapper.findAll('button')
    
    expect(buttons[0].attributes('aria-selected')).toBe('false')
    expect(buttons[1].attributes('aria-selected')).toBe('true')
    expect(buttons[2].attributes('aria-selected')).toBe('false')
  })

  it('should set tabindex correctly for keyboard navigation', () => {
    const wrapper = mount(CurrencyTabbing, {
      props: {
        modelValue: timeframes[1],
        timeframes
      }
    })

    const buttons = wrapper.findAll('button')
    
    expect(buttons[0].attributes('tabindex')).toBe('-1')
    expect(buttons[1].attributes('tabindex')).toBe('0')
    expect(buttons[2].attributes('tabindex')).toBe('-1')
  })

  it('should have descriptive aria-label on each button', () => {
    const wrapper = mount(CurrencyTabbing, {
      props: {
        modelValue: timeframes[0],
        timeframes
      }
    })

    const buttons = wrapper.findAll('button')
    
    expect(buttons[0].attributes('aria-label')).toBe('Show 1D timeframe data')
    expect(buttons[1].attributes('aria-label')).toBe('Show 1W timeframe data')
    expect(buttons[2].attributes('aria-label')).toBe('Show 1M timeframe data')
  })

  it('should handle multiple navigation actions correctly', async () => {
    const wrapper = mount(CurrencyTabbing, {
      props: {
        modelValue: timeframes[0],
        timeframes
      }
    })

    const buttons = wrapper.findAll('button')
    
    await buttons[0].trigger('keydown', { key: 'ArrowRight' })
    await buttons[1].trigger('keydown', { key: 'ArrowRight' })
    await buttons[2].trigger('keydown', { key: 'ArrowLeft' })

    const emittedEvents = wrapper.emitted('update:modelValue')
    
    expect(emittedEvents).toHaveLength(3)
    
    expect(emittedEvents[0]).toEqual([timeframes[1]])
    expect(emittedEvents[1]).toEqual([timeframes[2]])
    expect(emittedEvents[2]).toEqual([timeframes[1]])
  })

  it('should work with different number of timeframes', () => {
    const twoTimeframes = [
      { multiplier: 1, timespan: 'day', label: '1D' },
      { multiplier: 1, timespan: 'week', label: '1W' }
    ]

    const wrapper = mount(CurrencyTabbing, {
      props: {
        modelValue: twoTimeframes[0],
        timeframes: twoTimeframes
      }
    })

    const buttons = wrapper.findAll('button')
    
    expect(buttons).toHaveLength(2)
  })

  it('should handle single timeframe correctly', async () => {
    const singleTimeframe = [
      { multiplier: 1, timespan: 'day', label: '1D' }
    ]

    const wrapper = mount(CurrencyTabbing, {
      props: {
        modelValue: singleTimeframe[0],
        timeframes: singleTimeframe
      }
    })

    const button = wrapper.find('button')
    
    await button.trigger('keydown', { key: 'ArrowRight' })
    
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([singleTimeframe[0]])
  })

  it('should update when modelValue prop changes', async () => {
    const wrapper = mount(CurrencyTabbing, {
      props: {
        modelValue: timeframes[0],
        timeframes
      }
    })

    await wrapper.setProps({ modelValue: timeframes[2] })

    const buttons = wrapper.findAll('button')
    
    expect(buttons[2].classes()).toContain('active')
    expect(buttons[2].attributes('aria-selected')).toBe('true')
    expect(buttons[2].attributes('tabindex')).toBe('0')
  })
})
