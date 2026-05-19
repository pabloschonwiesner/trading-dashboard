<template>
  <div>
    <button v-for="timeframe in timeframes" :key="timeframe.label">
      {{ timeframe.label }}
    </button>
  </div>
</template>

<script setup>

const timeframes = [
  { multiplier: 1, timespan: 'day', label: '1D' },
  { multiplier: 1, timespan: 'week', label: '1W' },
  { multiplier: 1, timespan: 'month', label: '1M' },
  { multiplier: 3, timespan: 'month', label: '3M' },
  { multiplier: 6, timespan: 'month', label: '6M' },
  { multiplier: 1, timespan: 'year', label: '1Y' },
  { multiplier: 2, timespan: 'year', label: 'ALL' },
]
</script>

<style scoped>

button {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
  margin: 0.75rem 0.75rem 0 0;
}
</style>