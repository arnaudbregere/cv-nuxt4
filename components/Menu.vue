<template>
  <div class="menu-wrapper">
    <MenuToggle 
      v-if="isMobile"
      :menuOpen="menuOpen"
      @open="toggleMenu"
      @close="closeMenu"
    />
    <ul :class="{ 'mobile-open': menuOpen }" v-show="!isMobile || menuOpen">
      <li v-if="isMobile && menuOpen" class="logo-container">
        <NuxtLink to="/" @click="closeMenu">
          <div class="logo-text">
            <h1 class="name">Arnaud Brègère</h1>
            <h2 class="title">Développeur Front-End</h2>
          </div>
        </NuxtLink>
      </li>
      <li v-for="route in menuRoutes" :key="route.section">
        <a href="#" @click.prevent="navigate(route.section)">{{ route.label }}</a>
      </li>
      <li>
        <a href="/pdf/arnaud_bregere.pdf" download="Arnaud-Bregere-CV.pdf" class="download-btn">
          Télécharger le CV
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { routes } from '~/config/routes';
import MenuToggle from './MenuToggle.vue';

const emit = defineEmits(['navigate']);

const menuOpen = ref(false);
const device = useDevice();
const isMobile = computed(() => device.isMobile);

const menuRoutes = computed(() => {
  const seen = new Set();
  return routes.filter(route => {
    if (seen.has(route.section)) return false;
    seen.add(route.section);
    return true;
  });
});

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const closeMenu = () => {
  menuOpen.value = false;
}

const navigate = (section: string) => {
  emit('navigate', section);
  closeMenu();
}
</script>

<style scoped lang="scss">
.menu-wrapper {
  position: relative;
}

ul {
  list-style: none;
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin: 0;
  padding: 1rem 2rem;
  background: rgba(0, 153, 255, 0.05);
  border-radius: 1.2rem;
  border: .1rem solid var(--glass-border);
  transition: transform 0.3s ease, opacity 0.3s ease;
  flex-direction: column;
  text-align: center;
  gap: 1rem;

  &.mobile-open {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 80vh;
  background: var(--bg-darker);
  border: none;
  border-radius: 0;
  padding: 1rem;
  z-index: 1;
  flex-direction: column;
  gap: 0.75rem;
  transform: translateY(0);
  opacity: 1;
  overflow-y: auto;
}
}



li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
}

a {
  color: var(--text-light);
  text-decoration: none;
  padding: 0.6rem 1.2rem;
  border: .1rem solid transparent;
  border-radius: 1.2rem;
  transition: all 0.3s ease;
  position: relative;
  font-weight: 600;
  letter-spacing: .1rem;
  text-transform: uppercase;
  font-size: 0.85rem;
  background: rgba(255, 255, 255, 0.03);
  width: 100%;
  text-align: center;
}

a::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 1.2rem;
  background: linear-gradient(135deg, var(--neon-blue), var(--electric-cyan));
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

a:hover {
  color: var(--bright-white);
  text-shadow: 0 0 1rem var(--bright-white);
  transform: translateY(-.2rem) scale(1.05);
  box-shadow: 0 1rem 2.5rem rgba(0, 153, 255, 0.4);
}

a:hover::before {
  opacity: 1;
}

a.download-btn {
  display: inline-flex;
  padding: 0.6rem 1.2rem;
  background-color: var(--neon-blue);
  color: var(--bg-deepest);
  border-radius: 1.2rem;
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: bold;
  justify-content: center;
  width: 100%;
}

a.download-btn:hover {
  background-color: var(--bg-deepest);
  color: var(--neon-blue);
  border: .1rem solid var(--electric-cyan);
  text-shadow: 0 0 .5rem var(--neon-blue);
  transform: translateY(-.2rem) scale(1.05);
}

@include respond-to(tablet) {
  ul {
    flex-direction: row;
    text-align: left;
    gap: 1.5rem;
  }

  li {
    width: auto;
  }

  a {
    width: auto;
  }
}

@include respond-to(desktop) {
  ul {
    flex-direction: row;
    position: static;
    background: rgba(0, 153, 255, 0.05);
    border: .1rem solid var(--glass-border);
    border-radius: 1.2rem;
    padding: 1rem 2rem;
    transform: none;
    opacity: 1;
    pointer-events: auto;
    width: auto;
  }
}
</style>