<template>
  <div class="bg-overlay">
    <div class="grid-pattern"></div>
    <div class="particles"></div>
    <div class="scanlines"></div>
    <div class="neo-circuits"></div>
  </div>
</template>

<script setup lang="ts">
import { useParticles, useCircuits } from '~/composables/useAnimations';

const { createParticles } = useParticles();
const { createCircuits } = useCircuits();

onMounted(() => {
  createParticles();
  createCircuits();
});
</script>

<style scoped lang="scss">
.bg-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.grid-pattern {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(0, 153, 255, 0.1) .1rem, transparent .1rem),
    linear-gradient(90deg, rgba(0, 153, 255, 0.1) .1rem, transparent .1rem);
  background-size: 6rem 6rem;
  animation: gridMove 25s linear infinite;
}

.scanlines {
  position: absolute;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent .2rem,
    rgba(0, 153, 255, 0.03) .2rem,
    rgba(0, 153, 255, 0.03) .4rem
  );
  animation: scanlineMove 0.1s linear infinite;
}
</style>
