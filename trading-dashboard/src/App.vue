<template>
  <header>
    🌐 FX Trading Dashboard
  </header>

  <main>
    <FieldSelect v-model="selectedExchange" :options="exchangeOptions" label="Exchange" />
    <div v-if="loading">Loading currency pairs...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else-if="data">
      <FieldSelect 
        label="Primary Symbol" 
        v-model="selectedPair" 
        :options="currencyPairOptions" 
        @update:modelValue="selectedPair = $event"
      />
      <CurrencyPair :pair="selectedPair" />
    </div>
  </main>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useAsyncRequest } from '@/composables/useAsyncRequest';
import { getCurrencyPairs } from '@/services/forexService';
import CurrencyPair from '@/components/CurrencyPair.vue';
import FieldSelect from '@/components/FieldSelect.vue';

const { execute: loadCurrencyPairs, loading, error, data } = useAsyncRequest(getCurrencyPairs);
const exchangeOptions = [ { value: 'fx', label: 'Forex (FX)' } ];

const selectedPair = ref({});
const selectedExchange = ref(exchangeOptions[0]);

const currencyPairOptions = computed(() => data.value?.map(pair => ({ value: pair, label: `${pair.symbol} - ${pair.name}` })) || []);

onMounted(async () => {
  await loadCurrencyPairs();
});
</script>


<style scoped>
header {
  line-height: 1.5;
  font-size: 1.25rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1.5rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }
}
</style>
