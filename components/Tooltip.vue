<template>
  <div class="tooltip-container">
    <slot />
    <span class="tooltip-text">{{ text }}</span>
  </div>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    required: true
  }
})
</script>

<style scoped lang="scss">
.tooltip-container {
  position: relative;
  display: inline-block;
}

.tooltip-text {
  visibility: hidden;
  position: absolute;
  bottom: 130%; 
  left: 50%;
  transform: translateX(-50%);
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  color: var(--bright-white);
  font-size: 0.8rem;
  font-weight: 500;
  text-align: center;
  padding: 8px 12px;
  border-radius: 0.6rem;
  backdrop-filter: blur(8px);
  white-space: nowrap;
  box-shadow: 0 0 12px var(--border-glow);

  opacity: 0;
  transform: translateX(-50%) translateY(5px);
  transition: opacity 0.3s ease, transform 0.3s ease;
  z-index: 20;
  &::after {
    content: "";
    position: absolute;
    top: 100%; 
    left: 50%;
    transform: translateX(-50%);
    border-width: 6px;
    border-style: solid;
    border-color: var(--glass-bg) transparent transparent transparent;
    filter: drop-shadow(0 0 6px var(--border-glow));
  }
}

.tooltip-container:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
</style>
