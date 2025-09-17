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
          <div class="logo-glow">
            <img src="/src/images/logo.png" alt="Logo Arnaud Brégère" class="logo" />
          </div>
          <div class="logo-text">
            <h1 class="name">Arnaud Brégère</h1>
            <h2 class="title">Développeur Front-End</h2>
          </div>
        </NuxtLink>
        
        <!-- Navigation moderne -->
        <nav class="main-nav">
          <div class="nav-container">
            <div class="nav-line"></div>
            <ul class="nav-list">
              <li><NuxtLink to="/" class="nav-link">Terminal</NuxtLink></li>
              <li><NuxtLink to="/calculatrice" class="nav-link">Calculatrice</NuxtLink></li>
              <li><NuxtLink to="/todolist" class="nav-link">TodoList</NuxtLink></li>
            </ul>
          </div>
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
            <span class="text">45, rue Lemercier<br>75017 Paris</span>
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

<script setup>
import { seoConfig } from '~/utils/seoConfig';

useHead({
  title: seoConfig.title,
  meta: seoConfig.meta,
  link: seoConfig.link,
  script: seoConfig.script,
});

// Particle and circuit animations
const createParticles = () => {
  const particlesContainer = document.querySelector('.particles');
  if (!particlesContainer) return;

  for (let i = 0; i < 60; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 10 + 's';
    particle.style.animationDuration = (5 + Math.random() * 10) + 's';

    const blueVariants = ['var(--neon-blue)', 'var(--electric-cyan)', 'var(--deep-blue)'];
    particle.style.background = blueVariants[Math.floor(Math.random() * blueVariants.length)];
    particle.style.boxShadow = `0 0 6px ${blueVariants[Math.floor(Math.random() * blueVariants.length)]}`;

    particlesContainer.appendChild(particle);
  }
};

const createCircuits = () => {
  const circuitsContainer = document.querySelector('.neo-circuits');
  if (!circuitsContainer) return;

  for (let i = 0; i < 5; i++) {
    const circuit = document.createElement('div');
    circuit.className = 'circuit-line';
    circuit.style.top = (20 + i * 20) + '%';
    circuit.style.animationDelay = i * 0.5 + 's';
    circuitsContainer.appendChild(circuit);
  }
};

const initScrollEffects = () => {
  window.addEventListener('scroll', () => {
    const header = document.querySelector('.modern-header');
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
};

// Initialize animations on mount
onMounted(() => {
  console.log("App montée - Design modernisé avec palette bleue");
  createParticles();
  createCircuits();
  initScrollEffects();
});

// Cleanup scroll event listener
onBeforeUnmount(() => {
  window.removeEventListener('scroll', initScrollEffects);
});
</script>

<style>
/* Palette de couleurs modernisée */
:root {
  --neon-blue: #0099ff;
  --electric-cyan: #00d4ff;
  --deep-blue: #0066cc;
  --accent-purple: #6366f1;
  --accent-pink: #ec4899;
  --bright-white: #ffffff;
  --soft-white: #f8fafc;
  --bg-dark: #0f0f23;
  --bg-darker: #08081a;
  --bg-deepest: #000000;
  --text-light: #e2e8f0;
  --text-dim: #94a3b8;
  --border-glow: rgba(0, 153, 255, 0.4);
  --glass-bg: rgba(15, 15, 35, 0.8);
  --glass-border: rgba(0, 212, 255, 0.3);
  --neo-shadow: 0 0 20px rgba(0, 153, 255, 0.3);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
  background: var(--bg-deepest);
  color: var(--text-light);
  overflow-x: hidden;
  line-height: 1.6;
}

#app {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Background animé modernisé */
.bg-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
}

.grid-pattern {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(0, 153, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 153, 255, 0.1) 1px, transparent 1px);
  background-size: 60px 60px;
  animation: gridMove 25s linear infinite;
}

.particles {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.particle {
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  animation: float linear infinite;
}

.scanlines {
  position: absolute;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 153, 255, 0.03) 2px,
    rgba(0, 153, 255, 0.03) 4px
  );
  animation: scanlineMove 0.1s linear infinite;
}

.neo-circuits {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.circuit-line {
  position: absolute;
  left: -100%;
  width: 100px;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--electric-cyan), transparent);
  animation: circuitFlow 8s linear infinite;
  box-shadow: 0 0 10px var(--electric-cyan);
}

/* Header moderne */
.modern-header {
  background: var(--glass-bg);
  backdrop-filter: blur(25px) saturate(200%);
  border-bottom: 1px solid var(--glass-border);
  padding: 1.5rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: all 0.3s ease;
}

.modern-header.scrolled {
  box-shadow: 0 8px 32px rgba(0, 153, 255, 0.3);
  background: var(--glass-bg);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
}

.logo-glow {
  position: relative;
}

.logo {
  max-width: 80px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.logo-glow::before {
  content: '';
  position: absolute;
  inset: -8px;
  background: radial-gradient(circle, var(--neon-blue) 10%, transparent 60%);
  opacity: 0.3;
  z-index: -1;
  border-radius: 16px;
  transition: opacity 0.3s ease;
}

.logo-container:hover .logo-glow::before {
  opacity: 0.6;
}

.logo-container:hover .logo {
  transform: scale(1.05);
  box-shadow: 0 0 20px var(--neon-blue);
}

.name {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--bright-white);
  text-shadow: 0 0 10px var(--neon-blue);
}

.title {
  font-size: 1rem;
  color: var(--text-dim);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.nav-container {
  position: relative;
  padding: 1rem 2rem;
  background: rgba(0, 153, 255, 0.05);
  border-radius: 12px;
  border: 1px solid var(--glass-border);
}

.nav-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, 
    transparent, 
    var(--neon-blue) 20%, 
    var(--electric-cyan) 50%,
    var(--accent-purple) 80%, 
    transparent
  );
  border-radius: 3px;
  animation: colorShift 3s ease-in-out infinite alternate;
}

.nav-list {
  list-style: none;
  display: flex;
  gap: 1.5rem;
  margin: 0;
}

.nav-link {
  color: var(--text-light);
  text-decoration: none;
  padding: 0.8rem 1.5rem;
  border: 1px solid transparent;
  border-radius: 12px;
  transition: all 0.3s ease;
  position: relative;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-size: 0.85rem;
  background: rgba(255, 255, 255, 0.03);
}

.nav-link::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--neon-blue), var(--electric-cyan));
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.nav-link:hover {
  color: var(--bright-white);
  text-shadow: 0 0 10px var(--bright-white);
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 10px 25px rgba(0, 153, 255, 0.4);
}

.nav-link:hover::before {
  opacity: 1;
}

.nav-link.router-link-active {
  color: var(--neon-blue);
  border-color: var(--neon-blue);
  text-shadow: 0 0 15px var(--neon-blue);
  background: rgba(0, 153, 255, 0.1);
}

/* Main content */
.modern-main {
  flex: 1;
  position: relative;
  padding: 3rem 0;
}

.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Footer ultra-moderne */
.modern-footer {
  background: var(--glass-bg);
  backdrop-filter: blur(25px) saturate(200%);
  border-top: 1px solid var(--glass-border);
  padding: 3rem 0;
  margin-top: auto;
  box-shadow: 0 -8px 32px rgba(0, 153, 255, 0.2);
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: linear-gradient(145deg, rgba(0, 153, 255, 0.05), rgba(0, 212, 255, 0.03));
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
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
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 15px 35px rgba(0, 153, 255, 0.3);
  border-color: var(--neon-blue);
}

.contact-item .icon {
  font-size: 1.5rem;
  filter: hue-rotate(200deg) brightness(1.2);
}

.contact-item .text {
  color: var(--text-dim);
  line-height: 1.5;
  font-weight: 500;
}

.email-link {
  color: var(--neon-blue);
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: 600;
}

.email-link:hover {
  color: var(--electric-cyan);
  text-shadow: 0 0 15px var(--electric-cyan);
}

.footer-line {
  height: 2px;
  background: linear-gradient(90deg, 
    transparent, 
    var(--neon-blue) 15%, 
    var(--electric-cyan) 35%, 
    var(--accent-purple) 65%, 
    var(--accent-pink) 85%, 
    transparent
  );
  margin: 3rem 0 2rem 0;
  border-radius: 2px;
  animation: colorFlow 4s ease-in-out infinite;
}

.copyright {
  text-align: center;
  color: var(--text-dim);
  font-size: 0.95rem;
  letter-spacing: 1px;
  font-weight: 500;
}

/* Animations modernisées */
@keyframes gridMove {
  0% { transform: translate(0, 0); }
  100% { transform: translate(60px, 60px); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 1; }
  25% { transform: translateY(-15px) rotate(90deg); opacity: 0.8; }
  50% { transform: translateY(-25px) rotate(180deg); opacity: 1; }
  75% { transform: translateY(-15px) rotate(270deg); opacity: 0.8; }
}

@keyframes scanlineMove {
  0% { transform: translateY(0); }
  100% { transform: translateY(4px); }
}

@keyframes circuitFlow {
  0% { left: -100%; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { left: 100%; opacity: 0; }
}

@keyframes borderGlow {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

@keyframes navScan {
  0% { left: -100%; }
  100% { left: 100%; }
}

@keyframes colorShift {
  0% { filter: hue-rotate(0deg); }
  100% { filter: hue-rotate(60deg); }
}

@keyframes colorFlow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Scrollbar futuriste */
::-webkit-scrollbar {
  width: 14px;
}

::-webkit-scrollbar-track {
  background: var(--bg-darker);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(45deg, var(--neon-blue), var(--electric-cyan));
  border-radius: 10px;
  border: 2px solid var(--bg-darker);
  box-shadow: inset 0 0 10px rgba(0, 153, 255, 0.5);
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(45deg, var(--electric-cyan), var(--accent-purple));
  box-shadow: inset 0 0 15px rgba(0, 212, 255, 0.7);
}

/* Sélection de texte */
::selection {
  background: var(--neon-blue);
  color: var(--bright-white);
}

::-moz-selection {
  background: var(--neon-blue);
  color: var(--bright-white);
}

/* Responsive Design amélioré */
@media (max-width: 1200px) {
  .header-content,
  .content-wrapper,
  .footer-content {
    padding: 0 1.5rem;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .logo-container {
    justify-content: center;
  }
  
  .nav-list {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .contact-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .logo {
    max-width: 60px;
  }
  
  .name {
    font-size: 1.2rem;
  }
  
  .title {
    font-size: 0.8rem;
  }
  
  .nav-container {
    padding: 1rem 1.5rem;
  }
}

@media (max-width: 480px) {
  .modern-main {
    padding: 2rem 0;
  }
  
  .modern-footer {
    padding: 2rem 0;
  }
  
  .nav-container {
    padding: 1rem;
  }
  
  .nav-link {
    font-size: 0.8rem;
    padding: 0.6rem 1.2rem;
  }
  
  .contact-item {
    padding: 1.2rem;
  }
}
</style>