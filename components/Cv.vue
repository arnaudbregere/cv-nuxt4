<template>
  <div class="terminal-container">
    <!-- Boot écran + scanline modernisé -->
    <template v-if="!bootDone">
      <div class="boot-screen">
        <div class="boot-content">
          <div class="boot-logo">
            <div class="hexagon">
              <div class="hexagon-inner">
                <span class="boot-text">SYSTEM BOOT</span>
              </div>
            </div>
          </div>
          <div class="boot-progress">
            <div class="boot-bar"></div>
          </div>
          <div class="boot-status">Initializing Terminal...</div>
        </div>
        <div class="scanline"></div>
        <div class="grid-overlay"></div>
      </div>
    </template>


    <div v-if="showFlash" class="flash-screen">
      <div class="flash-pulse"></div>
    </div>

    <!-- Terminal après boot et flash -->
    <template v-if="bootDone && !showFlash">
      <div class="terminal-interface">
        <!-- Barre de titre moderne -->
        <div class="terminal-header">
          <div class="terminal-title">
            <span class="terminal-path">~/arnaud-bregere/portfolio</span>
            <div class="connection-status">
              <span class="status-indicator"></span>
              <span>CONNECTED</span>
            </div>
          </div>
        </div>

        <!-- Fenêtre terminal principale -->
        <div class="terminal-window">
          <div class="welcome-section">
            <pre class="initial-message">{{ initialMessage }}</pre>
          </div>

          <div v-if="showWelcome" class="ascii-container">
            <WelcomeAscii />
          </div>

          <div class="output-history">
            <pre v-for="(output, idx) in outputs" :key="idx" class="output-message" :class="output.type">{{ output.message }}</pre>
          </div>

          <div class="prompt-container">
            <div class="prompt-line">
              <span class="prompt-symbol">▶</span>
              <span class="prompt-path">root@portfolio:~$</span>
              <TerminalPrompt v-model:command="command" @enter="handleEnter" />
            </div>
          </div>

          <ProgressBar :loading="loading" :progress="progress" :section="currentSection" />

          <div v-if="showContent" class="content-display">
            <div class="content-frame">
              <div class="content-header">
                <div class="content-title">{{ currentSection.toUpperCase() }}</div>
                <div class="content-timestamp">{{ getCurrentTimestamp() }}</div>
              </div>
              <div class="content-body">
                <pre class="content-text" v-html="contentDisplayed"></pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>



<script setup lang="ts">
import { cvText, experienceText, formationText, competencesText, projetsText, contactText, helpText } from '~/utils/cv_content';
import type { SectionKey } from '~/types/sections';
import { useRoute, onBeforeRouteUpdate } from 'vue-router';
import { useNavigation } from '~/composables/useNavigation';

const route = useRoute();
const { processCommand, navigateToSection } = useNavigation();

const initialMessage = ref("");
const displayed = ref("");
let index = 0;

const showWelcome = ref(false);
const command = ref("");
const showContent = ref(false);
const loading = ref(false);
const progress = ref(0);

const contentDisplayed = ref("");
let contentIndex = 0;

const hasStarted = ref(false);
const bootDone = ref(false);
const showFlash = ref(false);
const currentSection = ref("");

// Historique des outputs pour messages de feedback
const outputs = ref<{ message: string; type: 'success' | 'error' | 'info' | 'special' }[]>([]);

// Contenu des sections
const sections: { [key in SectionKey]: string } = {
  cv: cvText,
  experience: experienceText,
  formation: formationText,
  competences: competencesText,
  projets: projetsText,
  contact: contactText,
  help: helpText,
};

function getCurrentTimestamp() {
  return new Date().toLocaleString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

function playSound(url: string) {
  const audio = new Audio(url);
  audio.volume = 0.3;
  audio.play().catch(() => {
    console.log("Son non disponible");
  });
}

function typeInitialMessage() {
  const text = "> Appuyez sur Entrée pour démarrer.";
  if (index < text.length) {
    initialMessage.value += text[index];
    index++;
    setTimeout(typeInitialMessage, 50);
  } else {
    index = 0;
  }
}

function typeASCII() {
  showWelcome.value = true;
}

function typeContent(text: string) {
  contentDisplayed.value = "";
  contentIndex = 0;

  function applyInlineStyles(input: string): string {
    return input
      .replace(/<span class="title"/g, '<span class="content-title-span"')
      .replace(/<span class="date"/g, '<span class="content-date-span"')
  }

  const styledText = applyInlineStyles(text);

  function type() {
    if (contentIndex < styledText.length) {
      contentDisplayed.value += styledText[contentIndex];
      contentIndex++;
      setTimeout(type, 3);
    }
  }
  type();
}

function handleEnter(enteredCommand: string) {
  // Trigger ASCII art on first Enter if not already started
  if (!hasStarted.value && !enteredCommand.trim()) {
    hasStarted.value = true;
    playSound("http://www.alienmovies.ca/html/sounds/alien1/mother.wav");
    setTimeout(() => {
      typeASCII();
    }, 500);
    return;
  }

  const result = processCommand(enteredCommand);

  outputs.value.push({
    message: result.message,
    type: result.type
  });

  if (result.success) {
    if (result.route) {
      updateSection(result.route.section as SectionKey);
      navigateToSection(result.route);
    } else if (result.type === 'special') {
      if (enteredCommand.toLowerCase() === 'clear') {
        outputs.value = [];
        showContent.value = false;
        showWelcome.value = false;
        currentSection.value = "";
        initialMessage.value = "";
        hasStarted.value = false;
        typeInitialMessage();
      } else if (['help', '?', 'aide'].includes(enteredCommand.toLowerCase())) {
        showContent.value = true;
        typeContent(helpText);
      }
    }
  }

  command.value = '';
}

// Navigation initiale et gestion des changements de route
function updateSection(section: SectionKey) {
  currentSection.value = section;
  loading.value = true;
  showContent.value = false;

  setTimeout(() => {
    loading.value = false;
    showContent.value = true;
    typeContent(sections[section]);
    // ⚡ Jouer le son à chaque mise à jour de section
    playSound("https://www.orangefreesounds.com/wp-content/uploads/2021/01/Sci-fi-beep-sound-effect.mp3");
  }, 1000);
}

onMounted(() => {
  // Démarrage du boot
  setTimeout(() => {
    showFlash.value = true;

    setTimeout(() => {
      showFlash.value = false;
      bootDone.value = true; 
      typeInitialMessage();
    }, 800); // durée du flash
  }, 3000); // durée boot

  // Vérification section initiale
  if (route.query.section && isSectionKey(route.query.section as string)) {
    updateSection(route.query.section as SectionKey);
  }
});

onBeforeRouteUpdate((to) => {
  if (to.query.section && isSectionKey(to.query.section as string)) {
    updateSection(to.query.section as SectionKey);
  }
});


// Vérification de type pour les sections
function isSectionKey(key: string): key is SectionKey {
  return key in sections;
}
</script>

<style scoped lang="scss">
/* Utilisation des variables de App.vue pour une cohérence bleue rétro-moderne */
.terminal-container {
  max-width: 180rem;
  margin: 1rem auto;
  background: var(--glass-bg);
  backdrop-filter: blur(1.5rem);
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: var(--neo-shadow);
}

.boot-screen {
  position: relative;
  width: 100%;
  height: 100%;
  background: var(--bg-deepest);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.boot-content {
  text-align: center;
  z-index: 1;
}

.boot-logo {
  margin-bottom: 1.5rem;
}

.hexagon {
  position: relative;
  width: 9rem;
  height: 7.8rem;
  background: var(--neon-blue);
  margin: 4rem auto;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  animation: hexagonPulse 2s ease-in-out infinite;
}

.hexagon-inner {
  position: absolute;
  top: .5rem;
  left: .5rem;
  right: .5rem;
  bottom: .5rem;
  background: var(--bg-deepest);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.boot-text {
  color: var(--electric-cyan);
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: .2rem;
  text-shadow: 0 0 1rem var(--neon-blue);
}

.boot-progress {
  width: 25rem;
  height: .8rem;
  background: rgba(0, 153, 255, 0.2);
  border-radius: .4rem;
  overflow: hidden;
  margin: 1.5rem auto;
}

.boot-bar {
  width: 0;
  height: 100%;
  background: var(--neon-blue);
  animation: bootProgress 3s ease-in-out forwards;
  box-shadow: 0 0 1.5rem var(--electric-cyan);
}

.boot-status {
  color: var(--text-light);
  font-family: 'Courier New', monospace;
  letter-spacing: .1rem;
  animation: textGlow 1.5s ease-in-out infinite alternate;
  text-shadow: 0 0 1rem var(--neon-blue);
  font-size: 1rem;
}

.scanline {
  position: absolute;
  top: -10%;
  left: 0;
  width: 100%;
  height: .5rem;
  background: rgba(0, 212, 255, 0.3);
  animation: scanlineMove 3s linear infinite;
  box-shadow: 0 0 2rem var(--electric-cyan);
}

.grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: 5rem 5rem;
  background-image: 
    linear-gradient(rgba(0, 153, 255, 0.1) .1rem, transparent .1rem),
    linear-gradient(90deg, rgba(0, 153, 255, 0.1) .1rem, transparent .1rem);
  animation: gridFloat 60s linear infinite;
  opacity: 0.3;
}

.flash-screen {
  position: fixed; 
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: var(--bright-white);
  z-index: 9999; 
  display: flex;
  align-items: center;
  justify-content: center;
  animation: modernFlash 0.8s ease-out forwards;
}

.flash-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: var(--neon-blue);
  border-radius: 50%;
  animation: pulseExpand 0.8s ease-out forwards;
  box-shadow: 0 0 5rem var(--electric-cyan);
}

.terminal-interface {
  padding: 1rem;
  position: relative;
}

.terminal-header {
  display: flex;
  align-items: center;
  justify-content: end;
  background: var(--glass-bg);
  backdrop-filter: blur(1rem);
  border: .1rem solid var(--border-glow);
  border-radius: 1rem 1rem 0 0;
  padding: 0.8rem;
  margin-bottom: 0;
}

.terminal-title {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  color: var(--electric-cyan);
  font-family: 'Courier New', monospace;
}

.terminal-path {
  font-size: 0.9rem;
  letter-spacing: .1rem;
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
}

.status-indicator {
  width: .8rem;
  height: .8rem;
  background: var(--neon-blue);
  border-radius: 50%;
  animation: statusBlink 2s ease-in-out infinite;
  box-shadow: 0 0 1rem var(--electric-cyan);
}

.terminal-window {
  background: var(--glass-bg);
  backdrop-filter: blur(1.5rem);
  border: .1rem solid var(--border-glow);
  border-top: none;
  border-radius: 0 0 1rem 1rem;
  padding: 1rem;
  color: var(--electric-cyan);
  font-family: 'Courier New', monospace;
  line-height: 1.6;
  position: relative;
  overflow-y: auto;
  overflow-x: auto;
  max-height: 70vh;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.terminal-window::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent .2rem,
      rgba(0, 212, 255, 0.02) .2rem,
      rgba(0, 212, 255, 0.02) .4rem
    );
  pointer-events: none;
  z-index: 0;
}

.welcome-section {
  position: relative;
  z-index: 1;
}

.initial-message {
  color: var(--neon-blue);
  font-size: 1rem;
  text-shadow: 0 0 1rem var(--electric-cyan);
  margin-bottom: 1.5rem;
}

.ascii-container {
  position: relative;
  margin: 1.5rem 0;
  z-index: 1;
}

.hologram-effect {
  position: relative;
  padding: 0.8rem;
  background: rgba(0, 212, 255, 0.05);
  border: .1rem solid rgba(0, 212, 255, 0.3);
  border-radius: .8rem;
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

.prompt-container {
  margin: 1.5rem 0;
  position: relative;
  z-index: 1;
}

.prompt-line {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(0, 212, 255, 0.05);
  padding: 0.5rem;
  border-radius: .5rem;
  border-left: .3rem solid var(--electric-cyan);
}

.prompt-symbol {
  color: var(--neon-blue);
  font-size: 1.2rem;
  text-shadow: 0 0 1rem var(--electric-cyan);
}

.prompt-path {
  color: var(--electric-cyan);
  font-weight: bold;
  font-size: 1rem;
}

.output-history {
  margin-top: 1rem;
  max-height: 20vh;
  overflow-y: auto;
}

.output-message {
  white-space: pre-wrap;
  word-wrap: break-word;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.output-message.success {
  color: green;
}

.output-message.error {
  color: red;
}

.output-message.info {
  color: blue;
}

.output-message.special {
  color: orange;
}

.content-display {
  margin-top: 1.5rem;
  position: relative;
  z-index: 1;
}

.content-frame {
  background: rgba(0, 0, 0, 0.4);
  border: .1rem solid rgba(0, 153, 255, 0.3);
  border-radius: .8rem;
  overflow: hidden;
}

.content-header {
  background: rgba(0, 153, 255, 0.1);
  padding: 0.8rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: .1rem solid rgba(0, 153, 255, 0.3);
}

.content-title {
  color: var(--neon-blue);
  font-weight: bold;
  font-size: 1.2rem;
  text-shadow: 0 0 1rem var(--electric-cyan);
}

.content-timestamp {
  color: var(--electric-cyan);
  font-size: 0.9rem;
  opacity: 0.8;
}

.content-body {
  padding: 1rem;
}

.content-text {
  color: var(--text-light);
  line-height: 1.6;
  font-size: 1.1rem;
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* Styles pour le contenu typé */
:deep(.content-title-span) {
  color: var(--neon-blue);
  text-shadow: 0 0 1rem var(--electric-cyan);
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
  font-size: 1.2rem;
}

:deep(.content-date-span) {
  color: var(--electric-cyan);
  text-shadow: 0 0 .5rem var(--neon-blue);
  font-style: italic;
  margin-left: 1rem;
  font-size: 1rem;
}

/* Animations */
@keyframes hexagonPulse {
  0% { transform: scale(1) rotate(0deg); }
  100% { transform: scale(1.1) rotate(5deg); }
}

@keyframes bootProgress {
  0% { width: 0%; }
  50% { width: 70%; }
  100% { width: 100%; }
}

@keyframes textGlow {
  0% { text-shadow: 0 0 .5rem var(--electric-cyan); }
  100% { text-shadow: 0 0 2rem var(--electric-cyan), 0 0 3rem var(--neon-blue); }
}

@keyframes scanlineMove {
  0% { top: -10%; opacity: 1; }
  100% { top: 110%; opacity: 0; }
}

@keyframes gridFloat {
  0% { transform: translate(0, 0); }
  100% { transform: translate(5rem, 5rem); }
}

@keyframes modernFlash {
  0% { opacity: 1; }
  100% { opacity: 0; }
}

@keyframes pulseExpand {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(20); opacity: 0; }
}

@keyframes statusBlink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0.3; }
}

@keyframes hologramScan {
  0% { transform: translateX(-100%) skewX(-15deg); }
  100% { transform: translateX(100%) skewX(-15deg); }
}

@keyframes glitchText {
  0%, 90%, 100% { transform: translate(0); }
  95% { transform: translate(-.1rem, .1rem); }
}

/* Responsive Design - Améliorations pour mobile */
@include respond-to(tablet) {
  .terminal-container {
    margin: 0.5rem;
    border-radius: 1rem;
  }

  .terminal-interface {
    padding: 0.5rem;
  }
  
  .terminal-header {
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.5rem;
  }
  
  .terminal-title {
    flex-direction: column;
    gap: 0.3rem;
    text-align: center;
  }

  .terminal-path {
    font-size: 0.8rem;
  }

  .connection-status {
    font-size: 0.7rem;
  }

  .terminal-window {
    padding: 0.5rem;
    font-size: 0.9rem;
    max-height: 60vh;
  }

  .initial-message {
    font-size: 1rem;
  }

  .ascii-container {
    margin: 1rem 0;
  }

  .hologram-effect {
    padding: 0.5rem;
  }

  .prompt-line {
    flex-wrap: wrap;
    gap: 0.3rem;
    padding: 0.3rem;
  }

  .prompt-symbol {
    font-size: 1rem;
  }

  .prompt-path {
    font-size: 0.9rem;
  }

  .content-header {
    flex-direction: column;
    gap: 0.3rem;
    padding: 0.5rem;
  }

  .content-title {
    font-size: 1.1rem;
  }

  .content-timestamp {
    font-size: 0.8rem;
  }

  .content-body {
    padding: 0.8rem;
  }

  .content-text {
    font-size: 1rem;
  }
}

@include respond-to(mobile) {
  .terminal-container {
    margin: 0.3rem;
    border-radius: .8rem;
  }

  .terminal-interface {
    padding: 0.3rem;
  }
  
  .terminal-window {
    padding: 1rem;
    font-size: 0.85rem;
    max-height: 50vh;
  }

  .boot-progress {
    width: 20rem;
  }

  .hexagon {
    width: 7rem;
    height: 6rem;
  }
  
  .boot-text {
    font-size: 0.7rem;
  }

  .initial-message {
    font-size: 0.9rem;
  }

  .ascii-container {
    margin: 0.8rem 0;
  }

  .hologram-effect {
    padding: 1rem;
  }

  .prompt-symbol {
    font-size: 0.9rem;
  }

  .prompt-path {
    font-size: 0.8rem;
  }

  .content-title {
    font-size: 1rem;
  }

  .content-text {
    font-size: 0.9rem;
  }

  .content-body {
    padding: 0.5rem;
  }
}
</style>
