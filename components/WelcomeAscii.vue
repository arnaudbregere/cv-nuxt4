<template>
  <div class="hologram-effect">
    <pre class="ascii-welcome" ref="welcomeRef">{{ welcomeText }}</pre>
    
    <pre v-if="!showInteractiveCommands" class="ascii-commands" ref="commandsRef">{{ commandText }}</pre>
    
    <div v-else class="interactive-commands">
      <span class="commands-prefix">> Commandes disponibles :</span>
      <ul class="commands-list">
        <li v-for="cmd in availableCommands" :key="cmd" @click="handleCommandClick(cmd)" class="command-item">
          {{ cmd }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
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

const showInteractiveCommands = ref(false);

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
    } else {
      showInteractiveCommands.value = true;  
    }
  }

  typeWelcome();
});

const availableCommands = ref(['cv', 'experience', 'formation', 'competences', 'projets', 'contact', 'help', 'clear']);
const emit = defineEmits(['selectCommand']);

const handleCommandClick = (cmd: string) => {
  emit('selectCommand', cmd);
};
</script>

<style scoped lang="scss">
.hologram-effect {
  position: relative;
  padding: 0.3rem; // mobile par défaut
  background: rgba(0, 212, 255, 0.05);
  border: .1rem solid rgba(0, 212, 255, 0.3);
  border-radius: .8rem;
  overflow: hidden;
}

.hologram-effect::before {
  content: '';
  position: absolute;
  top: -.2rem;
  left: -.2rem;
  right: -.2rem;
  bottom: -.2rem;
  background: linear-gradient(45deg, transparent, var(--electric-cyan), transparent);
  border-radius: 1rem;
  opacity: 0.5;
  z-index: -1;
  animation: hologramScan 3s linear infinite;
}

/* --- ASCII Welcome --- */
.ascii-welcome {
  color: orange;
  text-shadow: 0 0 .5rem var(--accent-purple);
  font-family: 'Courier New', monospace;
  font-size: 1.4rem; // mobile base
  line-height: 1.3;
  margin-bottom: 0.2rem;
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* --- ASCII Commands --- */
.ascii-commands {
  color: var(--electric-cyan);
  text-shadow: 0 0 .5rem var(--neon-blue);
  font-family: 'Courier New', monospace;
  font-size: 1.2rem; // mobile base
  line-height: 1.4;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.interactive-commands {
  color: var(--electric-cyan);
  text-shadow: 0 0 .5rem var(--neon-blue);
  font-family: 'Courier New', monospace;
  font-size: 1.2rem;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.commands-prefix {
  display: block;
  margin-bottom: 0.5rem;
}

.commands-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.command-item {
  cursor: pointer;
  padding: 0.3rem 0.8rem;
  background: rgba(0, 212, 255, 0.1);
  border: 1px solid var(--neon-blue);
  border-radius: 0.4rem;
  transition: all 0.3s;
  &:hover {
    background: rgba(0, 212, 255, 0.3);
    box-shadow: 0 0 1rem var(--electric-cyan);
    transform: scale(1.05);
  }
}

/* Tablet */
@include respond-to(tablet) {
  .hologram-effect {
    padding: 0.5rem;
  }

  .ascii-welcome {
    font-size: 1.5rem;
    margin-bottom: 0.3rem;
  }

  .ascii-commands {
    font-size: 1.3rem;
  }

  .interactive-commands {
    font-size: 1.3rem;
  }

  .command-item {
    padding: 0.4rem 1rem;
  }
}

/* Desktop */
@include respond-to(desktop) {
  .hologram-effect {
    padding: 0.8rem;
  }

  .ascii-welcome {
    font-size: 1rem; // plus petit sur desktop
    margin-bottom: 0.5rem;
  }

  .ascii-commands {
    font-size: 1.2rem;
  }

  .interactive-commands {
    font-size: 1.3rem;
  }

  .command-item {
    padding: 0.5rem 1.2rem;
  }
}

@keyframes hologramScan {
  0% { transform: translateX(-100%) skewX(-15deg); }
  100% { transform: translateX(100%) skewX(-15deg); }
}
</style>