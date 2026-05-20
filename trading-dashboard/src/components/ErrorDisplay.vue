<template>
  <div 
    class="error-display" 
    role="alert"
    aria-live="assertive"
  >
    <div class="error-display__icon" aria-hidden="true">
      <span v-if="errorInfo.type === 'error'">⚠️</span>
      <span v-else-if="errorInfo.type === 'warning'">⚡</span>
      <span v-else>ℹ️</span>
    </div>
    <div class="error-display__content">
      <h3 class="error-display__title">{{ errorInfo.title }}</h3>
      <p class="error-display__message">{{ errorInfo.message }}</p>
      <button 
        v-if="errorInfo.canRetry && showRetry"
        class="error-display__retry"
        @click="$emit('retry')"
        :aria-label="`Retry after ${errorInfo.retryAfter ? errorInfo.retryAfter + ' seconds' : 'error'}`"
      >
        Try Again
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getErrorMessage } from '@/utils/errorMessages'

const props = defineProps({
  error: {
    type: [Error, Object],
    required: true
  },
  showRetry: {
    type: Boolean,
    default: true
  }
})

defineEmits(['retry'])

const errorInfo = computed(() => getErrorMessage(props.error))
</script>

<style scoped>
.error-display {
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
  color: #ccc;
}

.error-display__icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.error-display__content {
  flex: 1;
}

.error-display__title {
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.error-display__message {
  font-size: 0.875rem;
  margin: 0 0 0.75rem 0;
  line-height: 1.5;
}

.error-display__retry {
  background-color: var(--color-primary);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.875rem;
  transition: opacity 0.2s;
}

.error-display__retry:hover {
  opacity: 0.9;
}

.error-display__retry:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.error-display__retry:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

@media (max-width: 768px) {
  .error-display {
    flex-direction: column;
    text-align: center;
  }
  
  .error-display__icon {
    align-self: center;
  }
}
</style>
