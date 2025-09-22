<template>
  <div class="hologram-effect">
    <pre class="ascii-welcome" ref="welcomeRef">{{ welcomeText }}</pre>
    <pre class="ascii-commands" ref="commandsRef">{{ commandText }}</pre>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const welcomeRef = ref<HTMLElement | null>(null);
const commandsRef = ref<HTMLElement | null>(null);
const welcomeText = ref("");
const commandText = ref("");
const index = ref(0);
const welcomeAscii = `  
BIENVENUE
`;
const commands = "Commandes disponibles: cv, experience, formation, competences, projets, contact, help, clear";

onMounted(() => {
  function typeWelcome() {
    if (index.value < welcomeAscii.length) {
      welcomeText.value += welcomeAscii[index.value];
      index.value++;
      requestAnimationFrame(typeWelcome);
    } else {
      index.value = 0;
      typeCommands();
    }
  }

  function typeCommands() {
    if (index.value < commands.length) {
      commandText.value += commands[index.value];
      index.value++;
      requestAnimationFrame(typeCommands);
    }
  }

  typeWelcome();
});
</script>

<style scoped>
.hologram-effect {
  position: relative;
  padding: 0.8rem;
  background: rgba(0, 212, 255, 0.05);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 8px;
  overflow: hidden;
}

.hologram-effect::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, transparent, var(--electric-cyan), transparent);
  border-radius: 10px;
  opacity: 0.5;
  z-index: -1;
  animation: hologramScan 3s linear infinite;
}

.ascii-welcome {
  color: var(--accent-purple);
  text-shadow: 0 0 5px var(--accent-purple);
  font-family: 'Courier New', monospace;
  font-size: 1.2rem; /* Increased from 0.9rem */
  line-height: 1.3;
  margin-bottom: 0.5rem;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.ascii-commands {
  color: var(--electric-cyan);
  text-shadow: 0 0 5px var(--neon-blue);
  font-family: 'Courier New', monospace;
  font-size: 1.0rem; /* Increased from 0.85rem */
  line-height: 1.4;
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* Responsive Design - Améliorations pour mobile */
@media (max-width: 768px) {
  .hologram-effect {
    padding: 0.5rem;
  }

  .ascii-welcome {
    font-size: 1.1rem; /* Increased from 0.8rem */
    margin-bottom: 0.3rem;
  }

  .ascii-commands {
    font-size: 0.9rem; /* Increased from 0.75rem */
  }
}

@media (max-width: 480px) {
  .hologram-effect {
    padding: 0.3rem;
  }

  .ascii-welcome {
    font-size: 1.0rem; /* Increased from 0.7rem */
    margin-bottom: 0.2rem;
  }

  .ascii-commands {
    font-size: 0.8rem; /* Increased from 0.65rem */
  }
}

@keyframes hologramScan {
  0% { transform: translateX(-100%) skewX(-15deg); }
  100% { transform: translateX(100%) skewX(-15deg); }
}
</style>