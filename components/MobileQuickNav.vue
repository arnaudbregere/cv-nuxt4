<template>
  <div v-if="isMobile" class="mobile-quick-nav">
    <button
      v-for="route in quickRoutes"
      :key="route.section"
      @click="navigate(route.section)"
      class="quick-nav-btn"
      :class="{ active: currentSection === route.section }"
      :aria-label="route.label"
    >
      <Icon :name="route.icon" :width="20" :height="20" class="nav-icon" />
      <span class="nav-label">{{ route.label }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import Icon from './Icon.vue';

const props = defineProps<{
  currentSection: string;
}>();

const emit = defineEmits(['navigate']);

const device = useDevice();
const isMobile = computed(() => device.isMobile);

const quickRoutes = [
  { section: 'cv', label: 'CV', icon: 'document' },
  { section: 'experience', label: 'Exp', icon: 'briefcase' },
  { section: 'formation', label: 'Formation', icon: 'graduation' },
  { section: 'competences', label: 'Skills', icon: 'lightning' },
  { section: 'projets', label: 'Projets', icon: 'rocket' },
  { section: 'contact', label: 'Contact', icon: 'mail' }
];

const navigate = (section: string) => {
  emit('navigate', section);
};
</script>

<style scoped lang="scss">

.mobile-quick-nav {
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  padding: 1rem;
  background: var(--glass-bg);
  backdrop-filter: blur(2rem);
  border-top: $border-style var(--border-glow);
}

.quick-nav-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background: rgba(0, 153, 255, 0.05);
  border: $border-style var(--border-glow);
  border-radius: 1rem;
  color: var(--text-light);
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: $transition-default;
  flex-shrink: 0;
  text-transform: uppercase;
  letter-spacing: 0.05rem;
  
  &:hover {
    background: var(--deep-blue);
    border-color: var(--electric-cyan);
    color: var(--bright-white);
    transform: translateY(-2px);
  }
  
  &:active {
    background: var(--deep-blue);
    transform: scale(0.95);
  }
  
  &.active {
    background: var(--electric-cyan);
    color: var(--bg-deepest);
    border-color: var(--electric-cyan);
    box-shadow: 0 0 1.5rem rgba(0, 212, 255, 0.6);
  }
}

.nav-icon {
  transition: $transition-default;
  filter: #{$icon-filter-base} invert(60%) sepia(100%) saturate(500%) hue-rotate(180deg);
  
  .quick-nav-btn:hover & {
    filter: #{$icon-filter-base} invert(100%);
  }
  
  .quick-nav-btn.active & {
    filter: #{$icon-filter-base} invert(0%);
  }
}

.nav-label {
  font-weight: bold;
}
</style>