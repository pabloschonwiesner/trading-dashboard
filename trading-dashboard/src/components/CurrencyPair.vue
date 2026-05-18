<template>
  <div>
    <h2>{{ pair.symbol }}</h2>
    <p>{{ pair.name }}</p>
  </div>
</template>

<script setup>
defineProps({
  pair: {
    type: Object,
    required: true
  }
});
</script>