<template>
  <footer class="retro-footer">
    <div class="footer-content">

      <div class="top-border"></div>


      <div class="contact-grid">

        <div class="contact-item">
          <span class="pixel-icon">📱</span>
          <div class="info-block">
            <span class="label">PHONE</span>
            <span class="value">06.07.98.52.85</span>
          </div>
        </div>

        <div class="contact-item">
          <span class="pixel-icon">📧</span>
          <div class="info-block">
            <span class="label">EMAIL</span>
            <a href="mailto:arnaud.bregere@gmail.com" class="value email-link">
              arnaud.bregere@gmail.com
            </a>
          </div>
        </div>
      </div>

      <div class="scan-line-container">
        <div class="scan-line"></div>
      </div>


      <div class="copyright">
        <span class="copyright-text">
          © 2025 ARNAUD BRÉGÈRE
          <span class="separator">|</span>
          DÉVELOPPEUR FRONT-END
        </span>
        <div class="pixel-decoration">
          <span class="pixel-square"></span>
          <span class="pixel-square"></span>
          <span class="pixel-square"></span>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.retro-footer {
  background: rgba(10, 15, 30, 0.85);
  border-top: 0.2rem solid var(--neon-blue);
  padding: 2.5rem 0 1.5rem;
  margin-top: auto;
  position: relative;
  font-family: 'Courier New', monospace;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 0.1rem;
    background: linear-gradient(
      90deg,
      transparent,
      var(--electric-cyan) 50%,
      transparent
    );
    animation: borderGlow 2s ease-in-out infinite;
  }
}

.footer-content {
  max-width: 140rem;
  margin: 0 auto;
  padding: 0 2rem;
}

.top-border {
  height: 0.2rem;
  background: linear-gradient(
    90deg,
    var(--neon-blue) 0%,
    var(--electric-cyan) 25%,
    var(--accent-purple) 50%,
    var(--electric-cyan) 75%,
    var(--neon-blue) 100%
  );
  margin-bottom: 2.5rem;
  opacity: 0.6;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(28rem, 1fr));
  gap: 3rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  padding: 0;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateX(0.5rem);
    
    .pixel-icon {
      transform: scale(1.1);
      filter: hue-rotate(200deg) brightness(1.5);
    }

    .label {
      color: var(--electric-cyan);
      text-shadow: 0 0 0.8rem var(--electric-cyan);
    }
  }
}

.pixel-icon {
  font-size: 2rem;
  filter: hue-rotate(200deg) brightness(1.2);
  transition: all 0.3s ease;
  image-rendering: pixelated;
  line-height: 1;
}

.info-block {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.label {
  font-size: 0.75rem;
  color: var(--neon-blue);
  font-weight: 700;
  letter-spacing: 0.2rem;
  text-transform: uppercase;
  opacity: 0.8;
  transition: all 0.3s ease;
}

.value {
  color: var(--text-dim);
  font-size: 0.95rem;
  line-height: 1.5;
  font-weight: 400;
  letter-spacing: 0.05rem;
}

.email-link {
  color: var(--electric-cyan);
  text-decoration: none;
  transition: all 0.3s ease;
  word-break: break-all;
  
  &:hover {
    color: var(--accent-pink);
    text-shadow: 0 0 1rem var(--accent-pink);
    text-decoration: underline;
  }
}

.scan-line-container {
  position: relative;
  height: 0.3rem;
  margin: 2.5rem 0 2rem;
  background: rgba(0, 153, 255, 0.1);
  overflow: hidden;
}

.scan-line {
  position: absolute;
  top: 0;
  left: -50%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    var(--electric-cyan),
    transparent
  );
  animation: scan 3s ease-in-out infinite;
}

.copyright {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding-top: 1rem;
}

.copyright-text {
  color: var(--text-dim);
  font-size: 0.85rem;
  letter-spacing: 0.15rem;
  text-transform: uppercase;
  text-align: center;
  opacity: 0.7;
}

.separator {
  margin: 0 1rem;
  color: var(--neon-blue);

  @media (max-width: 768px) {
    display: block;
    margin: 0.5rem 0;
  }
}

.pixel-decoration {
  display: flex;
  gap: 0.8rem;
}

.pixel-square {
  width: 0.8rem;
  height: 0.8rem;
  background: var(--neon-blue);
  box-shadow: 0 0 0.8rem var(--neon-blue);
  animation: pixelBlink 1.5s ease-in-out infinite;
  
  &:nth-child(2) {
    animation-delay: 0.3s;
    background: var(--electric-cyan);
    box-shadow: 0 0 0.8rem var(--electric-cyan);
  }
  
  &:nth-child(3) {
    animation-delay: 0.6s;
    background: var(--accent-purple);
    box-shadow: 0 0 0.8rem var(--accent-purple);
  }
}

@keyframes scan {
  0% {
    left: -50%;
  }
  100% {
    left: 150%;
  }
}

@keyframes pixelBlink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

@keyframes borderGlow {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .retro-footer {
    padding: 2rem 0 1.5rem;
  }

  .footer-content {
    padding: 0 1.5rem;
  }

  .contact-item {
    gap: 1rem;
  }

  .pixel-icon {
    font-size: 1.5rem;
  }

  .copyright-text {
    font-size: 0.75rem;
    letter-spacing: 0.1rem;
  }
}
</style>