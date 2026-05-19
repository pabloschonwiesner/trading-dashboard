<template>
  <div>
    <CurrencyFlags :baseCurrency="pair.baseCurrency" :quoteCurrency="pair.quoteCurrency" />
    <CurrencyChart />
  </div>
</template>

<script setup>
import CurrencyFlags from './CurrencyFlags.vue'
import CurrencyChart from './CurrencyChart.vue'

defineProps({
  pair: {
    type: Object,
    required: true
  }
});
</script>