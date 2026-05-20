<template>
  <div>
    <ErrorDisplay v-if="error" :error="error" @retry="initializeData" style="margin-top: 4rem;" />
    <template v-else>
      <CurrencyPrice :currentPrice="currentPrice" :difference="difference" />
      <CurrencyTabbing 
        v-model="selectedTimeframe" 
        :timeframes="timeframes"
        @update:modelValue="handleUpdateTimeFrame" 
      />
      <CurrencyPlot :data="chartData"/>
    </template>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useAsyncRequest } from '@/composables/useAsyncRequest';
import { getHistoricalRates, getPreviousClose } from '@/services/forexService';
import { createLocalStorageCache } from '@/cache/localStorageCache'
import CurrencyPrice from './CurrencyPrice.vue'
import CurrencyTabbing from './CurrencyTabbing.vue'
import CurrencyPlot from './CurrencyPlot.vue'
import ErrorDisplay from './ErrorDisplay.vue'

const { execute: loadHistoricalRates, loading, error, data } = useAsyncRequest(getHistoricalRates);
const { execute: loadPreviousClose, loading: loadingPreviousClose, error: errorPreviousClose, data: previousCloseData } = useAsyncRequest(getPreviousClose);

const cache = createLocalStorageCache({ prefix: 'forex' })

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
const chartData = ref([])
const currentPrice = ref(0.00)
const difference = ref(0.00)

const props = defineProps({
  pair: {
    type: Object,
    required: true
  }
})

function handleUpdateTimeFrame(timeframe) {
  selectedTimeframe.value = timeframe
  cache.set('selected-timeframe', timeframe)
  requestHistoricalData()
}

async function requestHistoricalData() {
  const today = new Date()
  const to = today.toISOString().split('T')[0]
  let from = new Date(today)
  if(['month', 'year'].includes(selectedTimeframe.value.timespan)) {
    from.setFullYear(today.getFullYear() - 2)
  } else {
    from.setFullYear(today.getFullYear() - 1)
  }

  from = from.toISOString().split('T')[0]

  chartData.value = await loadHistoricalRates({
    providerSymbol: props.pair.symbol, 
    multiplier: selectedTimeframe.value.multiplier, 
    timespan: selectedTimeframe.value.timespan,
    from,
    to
  })

  const lastRecord = chartData.value[chartData.value.length - 1]
  difference.value = lastRecord.close - lastRecord.open
}

async function loadPriceData() {
  const previousClose = await loadPreviousClose(props.pair.symbol)
  
  if (previousClose && previousClose.length > 0) {
    const previousCloseData = previousClose.sort((a, b) => b.timestamp - a.timestamp).reverse()[0]
    currentPrice.value = (previousCloseData && previousCloseData.close) || 0
  }
}

async function initializeData() {
  await requestHistoricalData()
  await loadPriceData()
}

watch(() => props.pair, initializeData, { immediate: true })

onMounted(() => {
  const cachedTimeframe = cache.get('selected-timeframe')
  if (cachedTimeframe) {
    selectedTimeframe.value = cachedTimeframe
  }
})
</script>

<style scoped>
</style>