<template>
  <div class="empty-state">
    <h2>No currency pair selected</h2>
    <p>Please select a currency pair from the dropdown</p>
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