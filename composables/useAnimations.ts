export const useParticles = () => {
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
      const color = blueVariants[Math.floor(Math.random() * blueVariants.length)] ?? 'var(--neon-blue)';
      particle.style.background = color;
      particle.style.boxShadow = `0 0 6px ${color}`;

      particlesContainer.appendChild(particle);
    }
  };
  return { createParticles };
};

export const useCircuits = () => {
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
  return { createCircuits };
};

export const useScrollEffects = () => {
  let onScroll: EventListenerOrEventListenerObject | null = null;

  const initScrollEffects = () => {
    onScroll = () => {
      const header = document.querySelector('.modern-header');
      if (!header) return;
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll);
  };

  const destroyScrollEffects = () => {
    if (onScroll) {
      window.removeEventListener('scroll', onScroll);
      onScroll = null;
    }
  };

  return { initScrollEffects, destroyScrollEffects };
};
