<template>
  <div class="menu-toggle-wrapper">
    <!-- Bouton Burger -->
    <button
      v-if="!menuOpen"
      class="menu-btn burger-btn"
      @click="openMenu"
      aria-label="Ouvrir le menu"
    >
      <Icon name="burger" :width="32" :height="32" />
    </button>

    <!-- Bouton Fermer (Croix) -->
    <button
      v-if="menuOpen"
      class="menu-btn close-btn"
      @click="closeMenu"
      aria-label="Fermer le menu"
    >
      <svg class="close-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 18L18 6M6 6L18 18" stroke="var(--neon-blue)" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import Icon from './Icon.vue';

defineProps<{
  menuOpen: boolean;
}>();

const emit = defineEmits(['open', 'close']);

const openMenu = () => {
  emit('open');
};

const closeMenu = () => {
  emit('close');
};
</script>

<style scoped lang="scss">
.menu-toggle-wrapper {
    z-index: 2;
  position: relative;
  display: inline-block;
}

.menu-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.5rem;
  height: 3.5rem;
  padding: 0;
  background: transparent;
  border: none;
  color: var(--electric-cyan);
  cursor: pointer;
  transition: $transition-default;
  
  &:hover {
    color: var(--bright-white);
  }
}

.burger-btn {
  animation: slideIn 0.3s ease forwards;
}

.close-btn {
  animation: slideIn 0.3s ease forwards;
}

.close-icon {
  stroke: currentColor;
  transition: $transition-default;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: rotate(-90deg);
  }
  to {
    opacity: 1;
    transform: rotate(0deg);
  }
}
</style>