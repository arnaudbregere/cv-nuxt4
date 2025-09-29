<template>
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
</template>

<style scoped lang="scss">
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
</style>
