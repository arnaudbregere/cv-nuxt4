<template>
  <div id="app">
    <!-- Background animé -->
    <div class="bg-overlay">
      <div class="grid-pattern"></div>
      <div class="particles"></div>
      <div class="scanlines"></div>
    </div>

    <header class="modern-header">
      <div class="header-content">
        <NuxtLink to="/" class="logo-container">
          <div class="logo-glow">
            <img src="/src/images/logo.png" alt="Logo" class="logo" />
          </div>
          <div class="logo-text">
            <span class="name">ARNAUD BRÉGÈRE</span>
            <span class="title">DÉVELOPPEUR FRONT-END</span>
          </div>
        </NuxtLink>
        
        <!-- Navigation moderne -->
        <nav class="main-nav">
          <div class="nav-container">
            <div class="nav-line"></div>
            <ul class="nav-list">
              <li><NuxtLink to="/" class="nav-link">TERMINAL</NuxtLink></li>
              <li><NuxtLink to="/calculatrice" class="nav-link">CALCULATRICE</NuxtLink></li>
              <li><NuxtLink to="/todolist" class="nav-link">TODOLIST</NuxtLink></li>
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

<script>
export default {
  mounted() {
    console.log("App montée - Design modernisé");
    this.createParticles();
    this.initScrollEffects();
  },
  
  methods: {
    createParticles() {
      const particlesContainer = document.querySelector('.particles');
      if (!particlesContainer) return;
      
      // Créer des particules animées
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.animationDuration = (5 + Math.random() * 10) + 's';
        particlesContainer.appendChild(particle);
      }
    },
    
    initScrollEffects() {
      window.addEventListener('scroll', () => {
        const header = document.querySelector('.modern-header');
        if (window.scrollY > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      });
    }
  }
}
</script>

<style>
/* Reset et variables CSS */
:root {
  --primary-green: #00ff41;
  --secondary-green: #00cc33;
  --accent-orange: #ff6b35;
  --accent-cyan: #00d4ff;
  --bg-dark: #0a0a0a;
  --bg-darker: #000000;
  --text-light: #e0e0e0;
  --text-dim: #a0a0a0;
  --border-glow: rgba(0, 255, 65, 0.3);
  --glass-bg: rgba(0, 0, 0, 0.7);
  --glass-border: rgba(0, 255, 65, 0.2);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Courier New', 'Consolas', monospace;
  background: var(--bg-darker);
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

/* Background animé */
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
    linear-gradient(rgba(0, 255, 65, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 65, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: gridMove 20s linear infinite;
}

.particles {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.particle {
  position: absolute;
  width: 2px;
  height: 2px;
  background: var(--primary-green);
  border-radius: 50%;
  animation: float linear infinite;
  box-shadow: 0 0 6px var(--primary-green);
}

.scanlines {
  position: absolute;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 255, 65, 0.03) 2px,
    rgba(0, 255, 65, 0.03) 4px
  );
  animation: scanlineMove 0.1s linear infinite;
}

/* Header moderne */
.modern-header {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--glass-border);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all 0.3s ease;
}

.modern-header.scrolled {
  background: rgba(0, 0, 0, 0.9);
  box-shadow: 0 4px 20px rgba(0, 255, 65, 0.2);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.logo-container:hover {
  transform: translateY(-2px);
}

.logo-glow {
  position: relative;
  padding: 0.5rem;
  border: 2px solid var(--primary-green);
  border-radius: 8px;
  background: rgba(0, 255, 65, 0.05);
  transition: all 0.3s ease;
}

.logo-glow::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 10px;
  padding: 2px;
  background: linear-gradient(45deg, var(--primary-green), var(--accent-cyan));
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.logo-container:hover .logo-glow::before {
  opacity: 1;
}

.logo {
  max-width: 60px;
  height: auto;
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.name {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--primary-green);
  text-shadow: 0 0 10px var(--primary-green);
  letter-spacing: 2px;
}

.title {
  font-size: 0.8rem;
  color: var(--accent-orange);
  letter-spacing: 1px;
  text-transform: uppercase;
}

/* Navigation moderne */
.main-nav {
  position: relative;
}

.nav-container {
  position: relative;
  padding: 1rem;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.nav-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, 
    transparent, 
    var(--primary-green) 30%, 
    var(--accent-cyan) 70%, 
    transparent
  );
  border-radius: 2px;
}

.nav-list {
  list-style: none;
  display: flex;
  gap: 2rem;
  margin: 0;
}

.nav-link {
  color: var(--text-light);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border: 1px solid transparent;
  border-radius: 6px;
  transition: all 0.3s ease;
  position: relative;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-size: 0.9rem;
}

.nav-link::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 6px;
  background: linear-gradient(45deg, var(--primary-green), var(--accent-cyan));
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.nav-link:hover {
  color: var(--bg-darker);
  text-shadow: none;
  transform: translateY(-2px);
}

.nav-link:hover::before {
  opacity: 1;
}

.nav-link.router-link-active {
  color: var(--primary-green);
  border-color: var(--primary-green);
  text-shadow: 0 0 10px var(--primary-green);
}

/* Main content */
.modern-main {
  flex: 1;
  position: relative;
  padding: 2rem 0;
}

.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Footer moderne */
.modern-footer {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border-top: 1px solid var(--glass-border);
  padding: 2rem 0;
  margin-top: auto;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(0, 255, 65, 0.05);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.contact-item:hover {
  background: rgba(0, 255, 65, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 255, 65, 0.2);
}

.contact-item .icon {
  font-size: 1.2rem;
  filter: grayscale(1) brightness(0.8);
}

.contact-item .text {
  color: var(--text-dim);
  line-height: 1.4;
}

.email-link {
  color: var(--primary-green);
  text-decoration: none;
  transition: all 0.3s ease;
}

.email-link:hover {
  color: var(--accent-cyan);
  text-shadow: 0 0 10px var(--accent-cyan);
}

.footer-line {
  height: 1px;
  background: linear-gradient(90deg, 
    transparent, 
    var(--primary-green) 20%, 
    var(--accent-orange) 50%, 
    var(--accent-cyan) 80%, 
    transparent
  );
  margin: 2rem 0 1rem 0;
}

.copyright {
  text-align: center;
  color: var(--text-dim);
  font-size: 0.9rem;
  letter-spacing: 1px;
}

/* Animations */
@keyframes gridMove {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

@keyframes scanlineMove {
  0% { transform: translateY(0); }
  100% { transform: translateY(4px); }
}

/* Scrollbar personnalisé */
::-webkit-scrollbar {
  width: 12px;
}

::-webkit-scrollbar-track {
  background: var(--bg-darker);
  border-radius: 6px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(var(--primary-green), var(--accent-cyan));
  border-radius: 6px;
  border: 2px solid var(--bg-darker);
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(var(--accent-cyan), var(--accent-orange));
}

/* Sélection de texte */
::selection {
  background: var(--primary-green);
  color: var(--bg-darker);
}

::-moz-selection {
  background: var(--primary-green);
  color: var(--bg-darker);
}

/* Responsive Design */
@media (max-width: 1200px) {
  .header-content {
    padding: 0 1rem;
  }
  
  .content-wrapper {
    padding: 0 1rem;
  }
  
  .footer-content {
    padding: 0 1rem;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .logo-container {
    justify-content: center;
  }
  
  .nav-list {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
  
  .contact-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .logo {
    max-width: 50px;
  }
  
  .name {
    font-size: 1rem;
  }
  
  .title {
    font-size: 0.7rem;
  }
}

@media (max-width: 480px) {
  .modern-main {
    padding: 1rem 0;
  }
  
  .modern-footer {
    padding: 1rem 0;
  }
  
  .nav-container {
    padding: 0.5rem;
  }
  
  .nav-link {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
}
</style>