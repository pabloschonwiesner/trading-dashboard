<template>
  <div>
    <CurrencyFlags :baseCurrency="pair.baseCurrency" :quoteCurrency="pair.quoteCurrency" />
  </div>
</template>

<script setup>
import CurrencyFlags from './CurrencyFlags.vue'

defineProps({
  pair: {
    type: Object,
    required: true
  }
});
</script>