<template>
  <header>
    🌐 FX Trading Dashboard
  </header>

  <main>
    <div class="selects-container">
      <FieldSelect v-model="selectedExchange" :options="exchangeOptions" label="Exchange" />
      <div v-if="loading">Loading currency pairs...</div>
      <div v-else-if="error">Error: {{ error.message }}</div>
      <FieldSelect 
        v-else-if="data"
        label="Primary Symbol" 
        v-model="selectedPair" 
        :options="currencyPairOptions" 
        @update:modelValue="handleSelectedPairChange"
      />
    </div>
    <div v-if="data && !loading && !error">
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
import { createLocalStorageCache } from '@/cache/localStorageCache'

const { execute: loadCurrencyPairs, loading, error, data } = useAsyncRequest(getCurrencyPairs);
const exchangeOptions = [ { value: 'fx', label: 'Forex (FX)' } ];

const cache = createLocalStorageCache({ prefix: 'forex' })

const selectedPair = ref({});
const selectedExchange = ref(exchangeOptions[0].value);

const currencyPairOptions = computed(() => data.value?.map(pair => ({ value: pair, label: `${pair.symbol} - ${pair.name}` })) || []);

function handleSelectedPairChange(pair) {
  selectedPair.value = pair;
  cache.set('selected-pair', pair);
}

onMounted(async () => {
  await loadCurrencyPairs();
  
  const cachedPair = cache.get('selected-pair');
  if (cachedPair && data.value) {
    selectedPair.value = cachedPair;
  }
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

.selects-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
}

@media (min-width: 768px) {
  .selects-container {
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }
}
</style>
