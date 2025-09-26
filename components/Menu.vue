<template>
  <div class="menu-wrapper">
    <button class="burger-btn" @click="toggleMenu" v-if="isMobile" aria-label="Ouvrir le menu">
    <Icon name="burger" width="32" height="32" />
    </button>
    <ul :class="{ 'mobile-open': menuOpen }" v-show="!isMobile || menuOpen">
      <button v-if="isMobile && menuOpen" class="close-btn" @click="closeMenu" aria-label="Fermer le menu">
        <svg class="close-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 18L18 6M6 6L18 18" stroke="var(--neon-blue)" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
      <li v-if="isMobile && menuOpen" class="logo-container">
        <NuxtLink to="/" @click="closeMenu">
           <div class="logo-text">
              <h1 class="name">Arnaud Brégère</h1>
              <h2 class="title">Développeur Front-End</h2>
          </div>
        </NuxtLink>
      </li>
      <li><a href="#" @click.prevent="navigate('cv')">CV</a></li>
      <li><a href="#" @click.prevent="navigate('experience')">Expériences</a></li>
      <li><a href="#" @click.prevent="navigate('formation')">Formation</a></li>
      <li><a href="#" @click.prevent="navigate('competences')">Compétences</a></li>
      <li><a href="#" @click.prevent="navigate('projets')">Projets</a></li>
      <li><a href="#" @click.prevent="navigate('works')">Works</a></li>
      <li><a href="#" @click.prevent="navigate('contact')">Contact</a></li>
      <li><a href="/pdf/arnaud_bregere.pdf" download="Arnaud-Bregere-CV.pdf" class="download-btn">Télécharger le CV</a></li>
    </ul>
  </div>
</template>

<script setup lang="ts">

const emit = defineEmits(['navigate']);

const menuOpen = ref(false);
const device = useDevice()
const isMobile = computed(() => device.isMobile)

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const closeMenu = () => {
  menuOpen.value = false;
}
const navigate = (section: string) => {
  emit('navigate', section);
  closeMenu();
};

</script>

<style scoped lang="scss">
.menu-wrapper {
  position: relative;
}

.burger-btn {
  background: none;
  border: none;
  color: var(--neon-blue);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: all 0.3s ease;
  z-index: 200;
}

.burger-btn:hover {
  color: var(--electric-cyan);
  text-shadow: 0 0 1rem var(--electric-cyan);
}

.burger-icon {
  transition: all 0.3s ease;
}

.burger-btn:hover .burger-icon {
  stroke: var(--electric-cyan);
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 201;
}

.close-icon {
  transition: all 0.3s ease;
}

.close-btn:hover .close-icon {
  stroke: var(--electric-cyan);
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
  flex-direction: column; // base mobile
  text-align: center;
  gap: 1rem;
}

ul.mobile-open {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: var(--bg-darker);
  border: none;
  border-radius: 0;
  padding: 2rem 1rem 1rem;
  z-index: 150;
  flex-direction: column;
  gap: 1rem;
  transform: translateY(0);
  opacity: 1;
  overflow-y: auto;
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
  padding: 0.8rem 1.5rem;
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
  padding: 0.8rem 1.5rem;
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
  .burger-btn {
    display: none;
  }

  .close-btn {
    display: none;
  }

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
