<template>
  <div class="currency-tabbing">
    <button 
      v-for="timeframe in timeframes" 
      :key="timeframe.label" 
      :class="{ active: modelValue.label === timeframe.label }" 
      @click="emit('update:modelValue', timeframe)"
    >
      {{ timeframe.label }}
    </button>
  </div>
</template>

<script setup>

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  timeframes: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])
</script>

<style scoped>

.currency-tabbing {
  border-top: 1px solid #dedede;
  padding: 1rem 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

button {
  padding: 0.5rem 1rem;
  color: var(--color-text);
  font-weight: 700;
  border: none;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
}

button:hover, button.active {
  background-color: var(--color-primary);
  color: white;
}
</style>