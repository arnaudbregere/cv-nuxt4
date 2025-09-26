<template>
  <div id="app">
    <!-- Background animé -->
    <div class="bg-overlay">
      <div class="grid-pattern"></div>
      <div class="particles"></div>
      <div class="scanlines"></div>
      <div class="neo-circuits"></div>
    </div>

    <header class="modern-header">
      <div class="header-content">
        <NuxtLink to="/" class="logo-container">
          <div class="logo-text">
            <h1 class="name">Arnaud Brégère</h1>
            <h2 class="title">Développeur Front-End</h2>
          </div>
        </NuxtLink>
        
        <!-- Navigation moderne avec Menu.vue -->
        <nav class="main-nav">
          <Menu @navigate="handleNavigation" />
        </nav>
      </div>
    </header>

    <main class="modern-main">
      <div class="content-wrapper">
        <NuxtPage />
      </div>
    </main>

    <footer class="modern-footer">
      <div class="footer-content">
        <div class="contact-grid">
          <div class="contact-item">
            <span class="icon">📍</span>
            <span class="text">45, rue Lemercier<br />75017 Paris</span>
          </div>
          <div class="contact-item">
            <span class="icon">📱</span>
            <span class="text">06.07.98.52.85</span>
          </div>
          <div class="contact-item">
            <span class="icon">📧</span>
            <a href="mailto:arnaud.bregere@gmail.com" class="email-link">
              arnaud.bregere@gmail.com
            </a>
          </div>
        </div>
        <div class="footer-line"></div>
        <div class="copyright">
          <span>&copy; 2025 Arnaud Brégère - Développeur Front-End</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { seoConfig } from '~/utils/seoConfig';
import { useParticles, useCircuits, useScrollEffects } from '~/composables/useAnimations';

const router = useRouter();

const { createParticles } = useParticles();
const { createCircuits } = useCircuits();
const { initScrollEffects, destroyScrollEffects } = useScrollEffects();

const handleNavigation = (section: string) => {
  if (['works'].includes(section)) {
    router.push(`/${section}`);
  } else {
    router.push({ path: '/', query: { section } });
  }
};

useHead({
  title: seoConfig.title,
  meta: seoConfig.meta,
  link: seoConfig.link,
  script: seoConfig.script,
})
onMounted(() => {
  createParticles();
  createCircuits();
  initScrollEffects();
});

onBeforeUnmount(() => {
  destroyScrollEffects();
});
</script>

<style lang="scss" scoped>
@use "/assets/scss/base.scss";
@use "/assets/scss/animations.scss";


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

/* --- Header --- */
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
  max-width: 7rem;
  border-radius: 1rem;
  transition: all 0.3s ease;
}

.logo-container:hover .logo {
  transform: scale(1.05);
  box-shadow: 0 0 1.5rem var(--neon-blue);
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

/* --- Main --- */
.main-nav {
  position: relative;
}
.modern-main {
  flex: 1;
  position: relative;
  margin-top: 10rem;
  padding: 2rem 0;
  z-index: 1;
}
.content-wrapper {
  max-width: 180rem;
  margin: 0 auto;
  padding: 0 1rem;
}

/* --- Footer --- */
.modern-footer {
  background: var(--glass-bg);
  backdrop-filter: blur(2rem) saturate(200%);
  border-top: .1rem solid var(--glass-border);
  padding: 2rem 0;
  margin-top: auto;
  box-shadow: 0 -.6rem 2.5rem rgba(0, 153, 255, 0.2);
  z-index: 1;
}

.footer-content {
  max-width: 180rem;
  margin: 0 auto;
  padding: 0 1rem;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(25rem, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: linear-gradient(145deg, rgba(0, 153, 255, 0.05), rgba(0, 212, 255, 0.03));
  border: .1rem solid var(--glass-border);
  border-radius: 1.2rem;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
  word-wrap: break-word;
}

.contact-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 153, 255, 0.1), transparent);
  transition: left 0.5s ease;
}
.contact-item:hover::before {
  left: 100%;
}
.contact-item:hover {
  background: linear-gradient(145deg, rgba(0, 153, 255, 0.15), rgba(0, 212, 255, 0.08));
  transform: translateY(-.3rem) scale(1.02);
  box-shadow: 0 1rem 2.5rem rgba(0, 153, 255, 0.3);
  border-color: var(--neon-blue);
}
.contact-item .icon {
  font-size: 1.3rem;
  filter: hue-rotate(200deg) brightness(1.2);
}
.contact-item .text {
  color: var(--text-dim);
  line-height: 1.5;
  font-weight: 500;
  font-size: 0.95rem;
}
.email-link {
  color: var(--neon-blue);
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: 600;
  word-break: break-all;
  font-size: 0.95rem;
}
.email-link:hover {
  color: var(--electric-cyan);
  text-shadow: 0 0 1.2rem var(--electric-cyan);
}

.footer-line {
  height: .2rem;
  background: linear-gradient(
    90deg,
    transparent,
    var(--neon-blue) 15%,
    var(--electric-cyan) 35%,
    var(--accent-purple) 65%,
    var(--accent-pink) 85%,
    transparent
  );
  margin: 2rem 0 1.5rem 0;
  border-radius: .2rem;
  animation: colorFlow 4s ease-in-out infinite;
}

.copyright {
  text-align: center;
  color: var(--text-dim);
  font-size: 0.9rem;
  letter-spacing: .1rem;
  font-weight: 500;
}

/* Scrollbar + responsive */
::-webkit-scrollbar {
  width: 1.2rem;
}
::-webkit-scrollbar-track {
  background: var(--bg-darker);
  border-radius: .8rem;
}
::-webkit-scrollbar-thumb {
  background: linear-gradient(45deg, var(--neon-blue), var(--electric-cyan));
  border-radius: .8rem;
  border: .2rem solid var(--bg-darker);
  box-shadow: inset 0 0 .8rem rgba(0, 153, 255, 0.5);
}
::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(45deg, var(--electric-cyan), var(--accent-purple));
  box-shadow: inset 0 0 1.2rem rgba(0, 212, 255, 0.7);
}

::selection {
  background: var(--neon-blue);
  color: var(--bright-white);
}
::-moz-selection {
  background: var(--neon-blue);
  color: var(--bright-white);
}

/* --- Responsive (mobile-first) --- */
@include respond-to(desktop) {
  .header-content,
  .content-wrapper,
  .footer-content {
    padding: 0 1rem;
  }
}

@include respond-to(tablet) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    padding: 0 0.8rem;
  }

  .logo-container {
    justify-content: center;
    margin-bottom: 0.8rem;
  }

  .main-nav {
    width: 100%;
    text-align: center;
  }

  .logo {
    max-width: 6rem;
  }

  .name {
    font-size: 1.2rem;
  }

  .title {
    font-size: 0.8rem;
  }

  .modern-main {
    margin-top: 11rem;
    padding: 1.5rem 0;
  }

  .content-wrapper {
    padding: 0 0.8rem;
  }

  .contact-grid {
        gap: 1rem;
  }

  .contact-item {
    flex-direction: row;
    align-items: center;
    gap: 0.8rem;
    padding: 0.8rem;
  }

  .contact-item .icon {
    font-size: 1.1rem;
  }

  .contact-item .text {
    font-size: 0.9rem;
  }

  .email-link {
    font-size: 0.9rem;
  }

  .footer-line {
    margin: 1.5rem 0;
  }

  .copyright {
    font-size: 0.85rem;
  }
}

@include respond-to(mobile) {
  .modern-header {
    padding: 0.8rem 0;
  }

  .header-content {
    padding: 0 0.5rem;
  }

  .content-wrapper {
    padding: 0 0.5rem;
  }

  .modern-footer {
    padding: 1.5rem 0;
  }

  .footer-content {
    padding: 0 0.5rem;
  }

  .contact-item {
    padding: 0.6rem;
    gap: 0.6rem;
  }

  .contact-item .icon {
    font-size: 1rem;
  }

  .contact-item .text {
    font-size: 0.85rem;
  }

  .email-link {
    font-size: 0.85rem;
  }

  .footer-line {
    margin: 1rem 0;
  }

  .copyright {
    font-size: 0.8rem;
  }
}
</style>
