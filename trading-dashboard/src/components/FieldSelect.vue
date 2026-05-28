<template>
    <div class="field-select">
        <label class="field-label" :for="inputId">{{ label }}</label>
        <select 
            v-model="model" 
            :id="inputId"
            :aria-label="label"
        >
            <option value="">Select an option</option>
            <option v-for="option in options" :key="option.value" :value="option.value">
            {{ option.label }}
            </option>
        </select>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';

let uniqueId = 0;
const generateId = () => `field-select-${++uniqueId}`;

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  modelValue: {
    type: [Object, String],
    required: true
  },
  options: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);

const inputId = ref(generateId());

const model = computed({
    set(value) {
        emit('update:modelValue', value);
    },
    get() {
        return props.modelValue;
    }
})
</script>

<style scoped>
.field-select {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

@media (min-width: 768px) {
  .field-select {
    margin-bottom: 0;
  }
}

.field-label {
  display: block;
  margin-bottom: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--color-text);
}

select {
  padding: 0.45rem;
  border-radius: 0.33rem;
  border: 1px solid var(--color-border);
  background-color: var(--color-background);
  color: var(--color-text);
  cursor: pointer;
  scrollbar-width: thin;
  scrollbar-color: var(--color-border-hover) var(--color-background-mute);
}

select:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-color: var(--color-primary);
}

select:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

select::-webkit-scrollbar {
  width: 12px;
}
 
select::-webkit-scrollbar-track {
  background: var(--color-background-mute);
}
 
select::-webkit-scrollbar-thumb {
  background: var(--color-border-hover);
  border-radius: 6px;
}
 
select::-webkit-scrollbar-thumb:hover {
  background: var(--color-text);
}
</style>