<template>
  <div class="currency-price" role="region" aria-label="Currency price information">
    <div class="current-price">
      <div class="column">
        <div class="label" id="exchange-label">EXCHANGE</div>
        <div class="value" aria-labelledby="exchange-label">FX</div>
      </div>
      <div class="column">
        <div class="label" id="price-label">CURRENT PRICE</div>
        <div class="value" aria-labelledby="price-label" aria-live="polite">{{ currentPrice }}</div>
      </div>
    </div>
    <div 
      class="timeframe-difference" 
      :class="{ 'timeframe-difference-up': difference > 0, 'timeframe-difference-down': difference < 0 }"
      role="status"
      aria-live="polite"
      :aria-label="priceChangeLabel"
    >
      <span class="arrow" aria-hidden="true">{{ difference == 0 ? '=' : difference > 0 ? '▲' : '▼' }}</span>
      <span class="sr-only">{{ difference > 0 ? 'Increased' : difference < 0 ? 'Decreased' : 'No change' }}</span>
      {{ difference.toFixed(6) }} ({{ percentage }}%)
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  currentPrice: {
    type: Number,
    required: true,
    default: 0.00
  },
  difference: {
    type: Number,
    required: true,
    default: 0.00
  }
})

const percentage = computed(() => {
  if(props.currentPrice === 0) return '0.00';
  return (props.difference / props.currentPrice * 100).toFixed(2)
})

const priceChangeLabel = computed(() => {
  const direction = props.difference > 0 ? 'increased' : props.difference < 0 ? 'decreased' : 'unchanged';
  return `Price ${direction} by ${Math.abs(props.difference).toFixed(6)} (${percentage.value}%)`;
})
</script>

<style scoped>
.currency-price {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  flex-wrap: wrap;
  gap: 1rem;
}

.current-price {
  display: flex;
  gap: 2rem;
}

.column {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}

.label {
  font-size: 0.65rem;
  font-weight: 600;
  color: #888;
}

.value {
  font-weight: 700;
  font-size: 1rem;
  color: #333;
  text-transform: uppercase;
  line-height: 1.1;
}

.timeframe-difference {
  background-color: #C9C9C9;
  padding: 0.15rem 0.3rem;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.timeframe-difference-up {
  background-color: #D1FAE5;
  color: #0FB981;
}

.timeframe-difference-down {
  background-color: #FEE2E2;
  color: #EF4444;
}

.arrow {
  font-size: 0.8rem;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

@media (min-width: 1024px) {
.value {
    font-size: 1.25rem;
  }
}
</style>