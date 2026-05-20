<template>
  <div class="empty-state" role="status" aria-live="polite">
    <h2>No currency pair selected</h2>
    <p>Please select a currency pair from the dropdown above to view exchange rate data</p>
  </div>
</template>

<script setup>
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  color: #ccc;
}
</style>