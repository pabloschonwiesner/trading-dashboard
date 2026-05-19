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
      <span class="arrow">▲</span> 0.003277 (1.41%)
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
  padding: 1rem 0;
}

.current-price {
  display: flex;
  gap: 2rem;
}

.column {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}

.label {
  font-size: 0.65rem;
  font-weight: 600;
  color: #888;
}

.value {
  font-weight: 700;
  font-size: 1.25rem;
  color: #333;
  text-transform: uppercase;
  line-height: 1.1;
}

.timeframe-difference {
  background-color: #D1FAE5;
  color: #0FB981;
  padding: 0.15rem 0.3rem;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.arrow {
  font-size: 0.7rem;
}
</style>