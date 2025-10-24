<template>
  <header class="modern-header">
    <div class="header-content">
      <NuxtLink to="/" class="logo-container">
        <img src="../../public/images/logo_ab.png" alt="Logo" class="logo" />

      </NuxtLink>
      <nav class="main-nav">
        <Menu @navigate="handleNavigation" />
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useNavigation } from '~/composables/useNavigation';

const { handleCommand } = useNavigation();

const handleNavigation = (section: string) => {
  // Utilise le système de navigation centralisé
  handleCommand(section);
};
</script>

<style scoped lang="scss">
.modern-header {
  width: 100%;
  background: var(--glass-bg);
  backdrop-filter: blur(2rem) saturate(200%);
  border-bottom: .1rem solid var(--glass-border);
  padding: 1rem 0;
  position: fixed;
  top: 0;
  z-index: 100;
  transition: all 0.3s ease;
}

.modern-header.scrolled {
  box-shadow: 0 .6rem 2.5rem rgba(0, 153, 255, 0.3);
  background: var(--glass-bg);
}

.header-content {
  width: 100%;
  margin: 0 auto;
  display: block;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  position: relative;
  z-index: 101;
}

.logo-container {
  display: block;
  align-items: center;
  margin: 0 auto 1rem auto;
  text-align: center;
  text-decoration: none;
}

.logo {
  max-width: 11rem;
  border-radius: 1rem;
  transition: all 0.3s ease;
}


.name {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--bright-white);
  text-shadow: 0 0 .8rem var(--neon-blue);
}

.title {
  font-size: 0.9rem;
  color: var(--text-dim);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: .1rem;
}

.main-nav {
    position: absolute;
    top: 0;
    right: 1rem;
}

@include respond-to(desktop) {
.main-nav {
    position: relative;
}
}
</style>