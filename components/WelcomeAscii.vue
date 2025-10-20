<template>
  <div class="hologram-effect">
    <div class="welcome-compact">
      <pre class="ascii-welcome" ref="welcomeRef">{{ welcomeText }}</pre>
      
      <div v-if="showInteractiveCommands" class="commands-container">
        <span class="commands-label">> Commandes à votre disposition :</span>
        <ul class="commands-grid">
          <li v-for="cmd in availableCommands" :key="cmd" @click="handleCommandClick(cmd)" class="command-item">
            {{ cmd }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { welcomeAscii, mobileWelcome, commandsList } from '~/utils/cv_content';

const welcomeRef = ref<HTMLElement | null>(null);
const welcomeText = ref("");
const index = ref(0);

const device = useDevice()
const isMobile = computed(() => device.isMobile)

// Version minimaliste de l'ASCII
const welcomeArt = isMobile.value ? mobileWelcome : welcomeAscii.trim().split('\n').slice(0, -1).join('\n');

const showInteractiveCommands = ref(false);

onMounted(() => {
  function typeWelcome() {
    if (index.value < welcomeArt.length) {
      const charsToAdd = welcomeArt.substr(index.value, 5);
      welcomeText.value += charsToAdd;
      index.value += charsToAdd.length;
      requestAnimationFrame(typeWelcome);
    } else {
      setTimeout(() => {
        showInteractiveCommands.value = true;  
      }, 300);
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
  padding: 0.5rem;
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

.welcome-compact {
  position: relative;
  z-index: 1;
}

/* --- ASCII Welcome --- */
.ascii-welcome {
  color: orange;
  text-shadow: 0 0 .5rem var(--accent-purple);
  font-family: 'Courier New', monospace;
  font-size: 1.2rem;
  line-height: 1.1;
  margin: 0 0 0.8rem 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* --- Commands Container --- */
.commands-container {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.commands-label {
  color: var(--electric-cyan);
  text-shadow: 0 0 .5rem var(--neon-blue);
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  letter-spacing: 0.1rem;
}

.commands-grid {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  gap: 0.5rem;
}

.command-item {
  cursor: pointer;
  padding: 0.4rem 0.6rem;
  background: rgba(0, 212, 255, 0.08);
  border: 1px solid var(--neon-blue);
  border-radius: 0.3rem;
  color: var(--electric-cyan);
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  text-align: center;
  text-shadow: 0 0 .3rem var(--neon-blue);
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(0, 212, 255, 0.2);
    box-shadow: 0 0 0.8rem var(--electric-cyan), inset 0 0 0.5rem rgba(0, 212, 255, 0.3);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 0 0.4rem var(--electric-cyan);
  }
}

/* Tablet */
@include respond-to(tablet) {
  .hologram-effect {
    padding: 0.6rem;
  }

  .ascii-welcome {
    font-size: 1.3rem;
    margin-bottom: 1rem;
  }

  .commands-label {
    font-size: 0.95rem;
  }

  .commands-grid {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 0.6rem;
  }

  .command-item {
    padding: 0.5rem 0.7rem;
    font-size: 0.85rem;
  }
}

/* Desktop */
@include respond-to(desktop) {
  .hologram-effect {
    padding: 0.8rem;
  }

  .ascii-welcome {
    font-size: 1rem;
    margin-bottom: 1rem;
    line-height: 1.2;
  }

  .commands-label {
    font-size: 1rem;
  }

  .commands-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 0.7rem;
  }

  .command-item {
    padding: 0.5rem 0.8rem;
    font-size: 0.9rem;
  }
}

@keyframes hologramScan {
  0% { transform: translateX(-100%) skewX(-15deg); }
  100% { transform: translateX(100%) skewX(-15deg); }
}
</style>