import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FieldSelect from './FieldSelect.vue'

describe('FieldSelect', () => {
  it('should render with required props', () => {
    const wrapper = mount(FieldSelect, {
      props: {
        label: 'Test Label',
        modelValue: '',
        options: []
      }
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('should display the label text', () => {
    const wrapper = mount(FieldSelect, {
      props: {
        label: 'Currency Pair',
        modelValue: '',
        options: []
      }
    })

    const label = wrapper.find('.field-label')
    
    expect(label.text()).toBe('Currency Pair')
  })

  it('should render all options', () => {
    const options = [
      { value: 'usd', label: 'US Dollar' },
      { value: 'eur', label: 'Euro' },
      { value: 'gbp', label: 'British Pound' }
    ]

    const wrapper = mount(FieldSelect, {
      props: {
        label: 'Currency',
        modelValue: '',
        options
      }
    })

    const optionElements = wrapper.findAll('option')
    
    expect(optionElements).toHaveLength(options.length + 1)
    
    expect(optionElements[1].text()).toBe('US Dollar')
    expect(optionElements[2].text()).toBe('Euro')
    expect(optionElements[3].text()).toBe('British Pound')
  })

  it('should set correct values for options', () => {
    const options = [
      { value: 'usd', label: 'US Dollar' },
      { value: 'eur', label: 'Euro' }
    ]

    const wrapper = mount(FieldSelect, {
      props: {
        label: 'Currency',
        modelValue: '',
        options
      }
    })

    const optionElements = wrapper.findAll('option')
    
    expect(optionElements[1].attributes('value')).toBe('usd')
    expect(optionElements[2].attributes('value')).toBe('eur')
  })

  it('should emit update:modelValue when selection changes', async () => {
    const options = [
      { value: 'usd', label: 'US Dollar' },
      { value: 'eur', label: 'Euro' }
    ]

    const wrapper = mount(FieldSelect, {
      props: {
        label: 'Currency',
        modelValue: '',
        options
      }
    })

    const select = wrapper.find('select')
    
    await select.setValue('eur')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['eur'])
  })

  it('should display the current modelValue', () => {
    const options = [
      { value: 'usd', label: 'US Dollar' },
      { value: 'eur', label: 'Euro' }
    ]

    const wrapper = mount(FieldSelect, {
      props: {
        label: 'Currency',
        modelValue: 'eur',
        options
      }
    })

    const select = wrapper.find('select')
    
    expect(select.element.value).toBe('eur')
  })

  it('should generate IDs with correct format for accessibility', () => {
    const options = [{ value: 'test', label: 'Test' }]

    const wrapper = mount(FieldSelect, {
      props: { label: 'First', modelValue: '', options }
    })

    const select = wrapper.find('select')
    const id = select.attributes('id')

    expect(id).toMatch(/^field-select-\d+$/)
    expect(id).toBeTruthy()
  })

  it('should associate label with select using for/id', () => {
    const wrapper = mount(FieldSelect, {
      props: {
        label: 'Currency',
        modelValue: '',
        options: []
      }
    })

    const label = wrapper.find('label')
    const select = wrapper.find('select')

    const labelFor = label.attributes('for')
    const selectId = select.attributes('id')

    expect(labelFor).toBe(selectId)
    expect(labelFor).toBeTruthy()
  })

  it('should have correct ARIA label', () => {
    const wrapper = mount(FieldSelect, {
      props: {
        label: 'Exchange',
        modelValue: '',
        options: []
      }
    })

    const select = wrapper.find('select')
    
    expect(select.attributes('aria-label')).toBe('Exchange')
  })

  it('should work with object values', async () => {
    const usdObject = { code: 'USD', name: 'US Dollar' }
    const eurObject = { code: 'EUR', name: 'Euro' }
    
    const options = [
      { value: usdObject, label: 'US Dollar' },
      { value: eurObject, label: 'Euro' }
    ]

    const wrapper = mount(FieldSelect, {
      props: {
        label: 'Currency',
        modelValue: usdObject,
        options
      }
    })

    expect(wrapper.exists()).toBe(true)
    
    const select = wrapper.find('select')
    
    await wrapper.vm.$emit('update:modelValue', eurObject)

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0][0]).toEqual(eurObject)
  })

  it('should have a default "Select an option" choice', () => {
    const wrapper = mount(FieldSelect, {
      props: {
        label: 'Test',
        modelValue: '',
        options: [{ value: 'test', label: 'Test' }]
      }
    })

    const options = wrapper.findAll('option')
    
    expect(options[0].text()).toBe('Select an option')
    expect(options[0].attributes('value')).toBe('')
  })
})
