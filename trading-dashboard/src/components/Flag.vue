<template>
  <div class="flag">
    <div v-if="!currencyCode" class="flag-placeholder"></div>
    <img 
      v-else-if="flagUrl"
      :src="flagUrl" 
      :alt="`${currencyCode} symbol`"
      class="flag-image"
      loading="lazy"
      crossorigin="anonymous"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getCountryFlag } from '@/services/flagService'

const props = defineProps({
  currencyCode: {
    type: String
  }
})

const flagUrl = computed(() => {
  return getCountryFlag(props.currencyCode)
})

</script>

<style scoped>
.flag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 20px;
  margin-right: 0.25rem;
}

.flag-placeholder {
  width: 100%;
  height: 100%;
  background-color: #ccc;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.flag-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #eee;
}

.currency-code {
  text-transform: uppercase;
}
</style>