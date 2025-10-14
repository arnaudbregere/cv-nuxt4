<template>
  <div v-if="isMobile" class="mobile-quick-nav">
    <button
      v-for="route in quickRoutes"
      :key="route.section"
      @click="navigate(route.section)"
      class="quick-nav-btn"
      :class="{ active: currentSection === route.section }"
    >
      <span class="nav-icon">{{ route.icon }}</span>
      <span class="nav-label">{{ route.label }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  currentSection: string;
}>();

const emit = defineEmits(['navigate']);

const device = useDevice();
const isMobile = computed(() => device.isMobile);

const quickRoutes = [
  { section: 'cv', label: 'CV', icon: '📄' },
  { section: 'experience', label: 'Exp', icon: '💼' },
  { section: 'formation', label: 'Formation', icon: '🎓' },
  { section: 'competences', label: 'Skills', icon: '⚡' },
  { section: 'projets', label: 'Projets', icon: '🚀' },
  { section: 'contact', label: 'Contact', icon: '📧' }
];

const navigate = (section: string) => {
  emit('navigate', section);
};
</script>

<style scoped lang="scss">
.mobile-quick-nav {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  padding: 0.8rem;
  background: var(--glass-bg);
  backdrop-filter: blur(2rem);
  border-top: .1rem solid var(--border-glow);

}

.quick-nav-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  padding: 0.8rem 1.2rem;
  background: rgba(0, 153, 255, 0.1);
  border: .1rem solid rgba(0, 153, 255, 0.3);
  border-radius: .8rem;
  color: var(--text-light);
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
  min-width: 6rem;
  
  &:active {
    transform: scale(0.95);
  }
  
  &.active {
    background: var(--neon-blue);
    color: var(--bg-deepest);
    border-color: var(--electric-cyan);
    box-shadow: 0 0 1.5rem rgba(0, 153, 255, 0.5);
  }
}

.nav-icon {
  font-size: 1.5rem;
}

.nav-label {
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: .05rem;
}
</style>