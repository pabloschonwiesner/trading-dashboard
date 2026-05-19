<template>
    <div class="field-select">
        <label class="field-label">{{ label }}</label>
        <select v-model="model">
            <option value="">Select an option</option>
            <option v-for="option in options" :key="option.value" :value="option.value">
            {{ option.label }}
            </option>
        </select>
    </div>
</template>

<script setup>
import { computed } from 'vue';

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

const model = computed({
    set(value) {
        emit('update:modelValue', value);
    },
    get() {
        return props.modelValue.value;
    }
})
</script>

<style scoped>
.field-select {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.field-label {
  display: block;
  margin-bottom: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

select {
    padding: 0.45rem;
    border-radius: 0.33rem;
    border-color: #ccc;
}

select:focus-visible {
    outline: none;
    border-color: var(--color-primary);
}

</style>