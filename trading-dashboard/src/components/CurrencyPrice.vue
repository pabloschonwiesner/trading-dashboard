<template>
  <div class="currency-price">
    <div class="current-price">
      <div class="column">
        <div class="label">EXCHANGE</div>
        <div class="value">FX</div>
      </div>
      <div class="column">
        <div class="label">CURRENT PRICE</div>
        <div class="value">0.23518</div>
      </div>
    </div>
    <div class="timeframe-difference">
      <span>&blacktriangle;</span> 0.003277 (1.41%)
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.currency-price {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100px;
}

.column {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}

.label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #888;
}

.value {
  font-weight: 700;
  color: #333;
  text-transform: uppercase;
}

.timeframe-difference {
  background-color: aquamarine;
  color: green;
  padding: 0.15rem 0.3rem;
  border-radius: 4px;
}
</style>