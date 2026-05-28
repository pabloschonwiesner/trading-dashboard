<template>
  <div class="currency-pair">
    <EmptyState v-if="!showCurrencyPair" />
    <template v-else>
      <CurrencyFlags :baseCurrency="pair.baseCurrency" :quoteCurrency="pair.quoteCurrency" />
      <CurrencyChart :pair="pair"/>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import CurrencyFlags from './CurrencyFlags.vue'
import CurrencyChart from './CurrencyChart.vue'
import EmptyState from '@/components/EmptyState.vue';

const props = defineProps({
  pair: {
    type: Object,
    required: true
  }
});

const showCurrencyPair = computed(() => props.pair && props.pair.symbol);

</script>

<style scoped>
.currency-pair {
  padding: 1.25rem 0;
  background-color: var(--color-background);
  border-radius: 8px;
  width: 100%;
  min-height: 400px;
  margin-top: 1.5rem;
}

@media (min-width: 768px) {
  .currency-pair {
    min-height: 500px;
  }
}

@media (min-width: 1024px) {
  .currency-pair {
    min-height: 570px;
  }
}
</style>