<template>
  <div>
    <CurrencyPrice />
    <CurrencyTabbing 
      v-model="selectedTimeframe" 
      :timeframes="timeframes"
      @update:modelValue="selectedTimeframe = $event" 
    />
    <CurrencyPlot />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import CurrencyPrice from './CurrencyPrice.vue'
import CurrencyTabbing from './CurrencyTabbing.vue'
import CurrencyPlot from './CurrencyPlot.vue'

const timeframes = [
  { multiplier: 1, timespan: 'day', label: '1D' },
  { multiplier: 1, timespan: 'week', label: '1W' },
  { multiplier: 1, timespan: 'month', label: '1M' },
  { multiplier: 3, timespan: 'month', label: '3M' },
  { multiplier: 6, timespan: 'month', label: '6M' },
  { multiplier: 1, timespan: 'year', label: '1Y' },
  { multiplier: 2, timespan: 'year', label: 'ALL' },
]
const selectedTimeframe = ref(timeframes[0]);


</script>

<style scoped>
</style>