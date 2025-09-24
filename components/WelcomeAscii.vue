<template>
  <div class="hologram-effect">
    <pre class="ascii-welcome" ref="welcomeRef">{{ welcomeText }}</pre>
    <pre class="ascii-commands" ref="commandsRef">{{ commandText }}</pre>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { welcomeAscii, mobileWelcome, commandsList } from '~/utils/cv_content';

const welcomeRef = ref<HTMLElement | null>(null);
const commandsRef = ref<HTMLElement | null>(null);
const welcomeText = ref("");
const commandText = ref("");
const index = ref(0);

const device = useDevice()
const isMobile = computed(() => device.isMobile)

// Utilise mobileWelcome pour mobile, sinon welcomeAscii
const welcomeArt = isMobile.value ? mobileWelcome : welcomeAscii.trim().split('\n').slice(0, -1).join('\n');
const commands = isMobile.value ? commandsList.replace('> ', '') : commandsList.replace('> ', '');

onMounted(() => {
  function typeWelcome() {
    if (index.value < welcomeArt.length) {
      // Type 3 caractères par frame pour accélérer
      const charsToAdd = welcomeArt.substr(index.value, 3);
      welcomeText.value += charsToAdd;
      index.value += charsToAdd.length;
      requestAnimationFrame(typeWelcome);
    } else {
      index.value = 0;
      typeCommands();
    }
  }

  function typeCommands() {
    if (index.value < commands.length) {
      // Type 3 caractères par frame pour accélérer
      const charsToAdd = commands.substr(index.value, 3);
      commandText.value += charsToAdd;
      index.value += charsToAdd.length;
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
  color: orange;
  text-shadow: 0 0 5px var(--accent-purple);
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  line-height: 1.3;
  margin-bottom: 0.5rem;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.ascii-commands {
  color: var(--electric-cyan);
  text-shadow: 0 0 5px var(--neon-blue);
  font-family: 'Courier New', monospace;
  font-size: 1.2rem;
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
    font-size: 1.5rem; /* Optimisé pour mobile */
    margin-bottom: 0.3rem;
  }

  .ascii-commands {
    font-size: 1.3rem; /* Optimisé pour mobile */
  }
}

@media (max-width: 480px) {
  .hologram-effect {
    padding: 0.3rem;
  }

  .ascii-welcome {
    font-size: 1.4rem; /* Ajusté pour petits écrans */
    margin-bottom: 0.2rem;
  }

  .ascii-commands {
    font-size: 1.2rem; /* Ajusté pour petits écrans */
  }
}

@keyframes hologramScan {
  0% { transform: translateX(-100%) skewX(-15deg); }
  100% { transform: translateX(100%) skewX(-15deg); }
}
</style>