<template>
  <div class="currency-tabbing" role="tablist" aria-label="Select timeframe for chart data">
    <button 
      v-for="(timeframe, index) in timeframes" 
      :key="timeframe.label"
      role="tab"
      :aria-selected="modelValue.label === timeframe.label"
      :aria-label="`Show ${timeframe.label} timeframe data`"
      :tabindex="modelValue.label === timeframe.label ? 0 : -1"
      :class="{ active: modelValue.label === timeframe.label }" 
      @click="emit('update:modelValue', timeframe)"
      @keydown="handleKeydown($event, index)"
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

const handleKeydown = (event, currentIndex) => {
  let newIndex = currentIndex;
  
  switch(event.key) {
    case 'ArrowLeft':
      event.preventDefault();
      newIndex = currentIndex > 0 ? currentIndex - 1 : props.timeframes.length - 1;
      break;
    case 'ArrowRight':
      event.preventDefault();
      newIndex = currentIndex < props.timeframes.length - 1 ? currentIndex + 1 : 0;
      break;
    case 'Home':
      event.preventDefault();
      newIndex = 0;
      break;
    case 'End':
      event.preventDefault();
      newIndex = props.timeframes.length - 1;
      break;
    default:
      return;
  }
  
  emit('update:modelValue', props.timeframes[newIndex]);
}
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

button:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
</style>