<template>
  <header>
    FX Dashboard
  </header>

  <main>
    <div v-if="loading">Loading currency pairs...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else-if="data">
      <select v-model="selectedPair">
        <option value="">Select a currency pair</option>
        <option v-for="pair in data" :key="pair.symbol" :value="pair">
          {{ pair.symbol }} - {{ pair.name }}
        </option>
      </select>

      <CurrencyPair v-if="selectedPair" :pair="selectedPair" />
      <EmptyState v-else />

      <p>Loaded {{ data.length }} currency pairs</p>
      <pre>{{ data.slice(0, 5) }}</pre>
    </div>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useAsyncRequest } from '@/composables/useAsyncRequest';
import { getCurrencyPairs } from '@/services/forexService';
import CurrencyPair from '@/components/CurrencyPair.vue';
import EmptyState from '@/components/EmptyState.vue';

const { execute: loadCurrencyPairs, loading, error, data } = useAsyncRequest(getCurrencyPairs);
const selectedPair = ref({});

onMounted(async () => {
  await loadCurrencyPairs();
});
</script>


<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
