<template>
  <div class="currency-flags">
    <Flag :currencyCode="baseCurrency" />
    <Flag :currencyCode="quoteCurrency" />
    <span class="symbol">{{ baseCurrency }} - {{ quoteCurrency }}</span>
  </div>
</template>

<script setup>
import Flag from './Flag.vue'

const props = defineProps({
  baseCurrency: {
    type: String
  },
  quoteCurrency: {
    type: String
  }
})
</script>

<style scoped>
.currency-flags {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.symbol {
  margin-left: 0.5rem;
  font-size: 20px;
  font-weight: 700;
}
</style>