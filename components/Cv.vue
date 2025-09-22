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
          <div class="boot-status">Initializing Quantum Terminal...</div>
        </div>
        <div class="scanline"></div>
        <div class="grid-overlay"></div>
      </div>
    </template>

    <!-- Flash avant affichage terminal -->
    <template v-else-if="showFlash">
      <div class="flash-screen">
        <div class="flash-pulse"></div>
      </div>
    </template>

    <!-- Terminal après boot et flash -->
    <template v-else>
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
          <!-- Message initial avec effet de typing moderne -->
          <div class="welcome-section">
            <pre class="initial-message">{{ initialMessage }}</pre>
          </div>

          <!-- ASCII art de bienvenue avec effet holographique -->
          <div v-if="showWelcome" class="ascii-container">
            <div class="hologram-effect">
              <pre class="ascii-art" v-html="displayed"></pre>
            </div>
          </div>

          <!-- Prompt modernisé -->
          <div class="prompt-container">
            <div class="prompt-line">
              <span class="prompt-symbol">▶</span>
              <span class="prompt-path">root@portfolio:~$</span>
              <TerminalPrompt v-model:command="command" @enter="handleEnter" />
            </div>
          </div>

          <!-- Progress bar modernisée -->
          <ProgressBar :loading="loading" :progress="progress" :section="currentSection" />

          <!-- Contenu affiché avec effects -->
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
import { cvText, experienceText, formationText, competencesText, projetsText, contactText, helpText, welcomeAscii } from '~/utils/cv_content';
import type { SectionKey } from '~/types/sections';
import { useRoute } from 'vue-router';

const route = useRoute();

const initialMessage = ref("");
const displayed = ref("");
let index = 0;

const showWelcome = ref(false);
const command = ref("");
const showContent = ref(false);
const loading = ref(false);
const progress = ref(0);
let progressInterval: number | null = null;

const contentDisplayed = ref("");
let contentIndex = 0;

const hasStarted = ref(false);
const bootDone = ref(false);
const showFlash = ref(false);
const currentSection = ref("");

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
  const text = "> Appuyez sur la touche Entrée pour démarrer...";
  if (index < text.length) {
    initialMessage.value += text[index];
    index++;
    setTimeout(typeInitialMessage, 50);
  } else {
    index = 0;
  }
}

function typeASCII() {
  if (index < welcomeAscii.length) {
    const char = welcomeAscii[index];
    displayed.value += `<span class="ascii-char">${char}</span>`;
    index++;
    setTimeout(typeASCII, 8);
  } else {
    index = 0;
  }
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
  if (!hasStarted.value) {
    hasStarted.value = true;
    playSound("http://www.alienmovies.ca/html/sounds/alien1/mother.wav");
    showWelcome.value = true;
    index = 0;
    typeASCII();
    command.value = "";
    return;
  }

  const cmd = enteredCommand.trim().toLowerCase();
  
  if (cmd === 'clear') {
    clearScreen();
    return;
  }
  
  if (isSectionKey(cmd)) {
    currentSection.value = cmd;
    displayed.value += `\n> Commande reconnue: "${cmd}"... Chargement...\n`;
    startLoading(cmd);
  } else {
    displayed.value += `\n> Commande inconnue: "${enteredCommand}". Tapez 'help' pour voir les commandes disponibles.\n`;
  }
  command.value = "";
}

function handleNavigation(section: string) {
  if (sections[section as SectionKey]) {
    currentSection.value = section as SectionKey;
    displayed.value += `\n> Navigation vers ${section}... Chargement...\n`;
    startLoading(section as SectionKey);
  }
}

function startLoading(section: string) {
  loading.value = true;
  progress.value = 0;
  if (progressInterval) clearInterval(progressInterval);
  progressInterval = setInterval(() => {
    progress.value += Math.random() * 10;
    if (progress.value >= 100) {
      progress.value = 100;
      clearInterval(progressInterval!);
      progressInterval = null;
      loading.value = false;
      showContent.value = true;
      typeContent(sections[section as SectionKey]);
      playSound("https://www.orangefreesounds.com/wp-content/uploads/2021/01/Sci-fi-beep-sound-effect.mp3");
    }
  }, 200);
}

function clearScreen() {
  displayed.value = "";
  showContent.value = false;
  showWelcome.value = false;
  command.value = "";
  currentSection.value = "";
  loading.value = false;
  progress.value = 0;
  initialMessage.value = "";
  hasStarted.value = false;
  typeInitialMessage();
}

// Écouter les événements de navigation depuis App.vue
onMounted(() => {
  typeInitialMessage();
  setTimeout(() => {
    bootDone.value = true;
    showFlash.value = true;
    setTimeout(() => {
      showFlash.value = false;
    }, 800);
  }, 3000);

  // Gérer la navigation basée sur la query string
  if (route.query.section && isSectionKey(route.query.section as string)) {
    currentSection.value = route.query.section as SectionKey;
    startLoading(route.query.section as string);
  }

  // Écouter les événements de navigation globaux
  window.addEventListener('navigate-section', (event: any) => {
    const section = event.detail;
    if (isSectionKey(section)) {
      currentSection.value = section;
      startLoading(section);
    }
  });
});

// === AJOUT : watcher pour réagir aux changements de query (router.push avec query) ===
watch(
  () => route.query.section,
  (newSection) => {
    if (newSection && isSectionKey(newSection as string)) {
      currentSection.value = newSection as SectionKey;
      startLoading(newSection as string);
    }
  }
);
// ================================================================

// Vérification de type pour les sections
function isSectionKey(key: string): key is SectionKey {
  return key in sections;
}
</script>

<style scoped lang="scss">
/* Utilisation des variables de App.vue pour une cohérence bleue rétro-moderne */
.terminal-container {
  max-width: 1800px;
  margin: 2rem auto;
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border-radius: 20px;
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
  margin-bottom: 2rem;
}

.hexagon {
  position: relative;
  width: 100px;
  height: 86.6px;
  background: var(--neon-blue);
  margin: 50px auto;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  animation: hexagonPulse 2s ease-in-out infinite;
}

.hexagon-inner {
  position: absolute;
  top: 5px;
  left: 5px;
  right: 5px;
  bottom: 5px;
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
  letter-spacing: 2px;
  text-shadow: 0 0 10px var(--neon-blue);
}

.boot-progress {
  width: 300px;
  height: 8px;
  background: rgba(0, 153, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin: 2rem auto;
}

.boot-bar {
  width: 0;
  height: 100%;
  background: var(--neon-blue);
  animation: bootProgress 3s ease-in-out forwards;
  box-shadow: 0 0 15px var(--electric-cyan);
}

.boot-status {
  color: var(--text-light);
  font-family: 'Courier New', monospace;
  letter-spacing: 1px;
  animation: textGlow 1.5s ease-in-out infinite alternate;
  text-shadow: 0 0 10px var(--neon-blue);
}

.scanline {
  position: absolute;
  top: -10%;
  left: 0;
  width: 100%;
  height: 5px;
  background: rgba(0, 212, 255, 0.3);
  animation: scanlineMove 3s linear infinite;
  box-shadow: 0 0 20px var(--electric-cyan);
}

.grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: 50px 50px;
  background-image: 
    linear-gradient(rgba(0, 153, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 153, 255, 0.1) 1px, transparent 1px);
  animation: gridFloat 60s linear infinite;
  opacity: 0.3;
}

.flash-screen {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--bright-white);
  animation: modernFlash 0.8s ease-out forwards;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
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
  box-shadow: 0 0 50px var(--electric-cyan);
}

.terminal-interface {
  padding: 1.5rem;
  position: relative;
}

.terminal-header {
  display: flex;
  align-items: center;
  justify-content: end;
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  border: 1px solid var(--border-glow);
  border-radius: 10px 10px 0 0;
  padding: 1rem 1.5rem;
  margin-bottom: 0;
}

.terminal-title {
  display: flex;
  align-items: center;
  gap: 2rem;
  color: var(--electric-cyan);
  font-family: 'Courier New', monospace;
}

.terminal-path {
  font-size: 0.9rem;
  letter-spacing: 1px;
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
}

.status-indicator {
  width: 8px;
  height: 8px;
  background: var(--neon-blue);
  border-radius: 50%;
  animation: statusBlink 2s ease-in-out infinite;
  box-shadow: 0 0 10px var(--electric-cyan);
}

.terminal-window {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-glow);
  border-top: none;
  border-radius: 0 0 10px 10px;
  padding: 2rem;
  color: var(--electric-cyan);
  font-family: 'Courier New', monospace;
  line-height: 1.6;
  position: relative;
  overflow: hidden;
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
      transparent 2px,
      rgba(0, 212, 255, 0.02) 2px,
      rgba(0, 212, 255, 0.02) 4px
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
  font-size: 1.1rem;
  text-shadow: 0 0 10px var(--electric-cyan);
  margin-bottom: 2rem;
}

.ascii-container {
  position: relative;
  margin: 2rem 0;
  z-index: 1;
}

.hologram-effect {
  position: relative;
  padding: 1rem;
  background: rgba(0, 212, 255, 0.05);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 8px;
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

.ascii-art {
  line-height: 1.1;
  font-size: 0.8rem;
}

.ascii-char {
  color: var(--accent-purple);
  text-shadow: 0 0 5px var(--accent-purple);
  display: inline;
  animation: glitchText 0.1s ease-in-out;
}

.prompt-container {
  margin: 2rem 0;
  position: relative;
  z-index: 1;
}

.prompt-line {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(0, 212, 255, 0.05);
  padding: 0.5rem;
  border-radius: 5px;
  border-left: 3px solid var(--electric-cyan);
}

.prompt-symbol {
  color: var(--neon-blue);
  font-size: 1.2rem;
  text-shadow: 0 0 10px var(--electric-cyan);
}

.prompt-path {
  color: var(--electric-cyan);
  font-weight: bold;
}

.content-display {
  margin-top: 2rem;
  position: relative;
  z-index: 1;
}

.content-frame {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(0, 153, 255, 0.3);
  border-radius: 8px;
  overflow: hidden;
}

.content-header {
  background: rgba(0, 153, 255, 0.1);
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0, 153, 255, 0.3);
}

.content-title {
  color: var(--neon-blue);
  font-weight: bold;
  font-size: 1.1rem;
  text-shadow: 0 0 10px var(--electric-cyan);
}

.content-timestamp {
  color: var(--electric-cyan);
  font-size: 0.8rem;
  opacity: 0.8;
}

.content-body {
  padding: 1.5rem;
}

.content-text {
  color: var(--text-light);
  line-height: 1.6;
}

/* Styles pour le contenu typé */
:deep(.content-title-span) {
  color: var(--neon-blue);
  text-shadow: 0 0 10px var(--electric-cyan);
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

:deep(.content-date-span) {
  color: var(--electric-cyan);
  text-shadow: 0 0 5px var(--neon-blue);
  font-style: italic;
  margin-left: 1rem;
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
  0% { text-shadow: 0 0 5px var(--electric-cyan); }
  100% { text-shadow: 0 0 20px var(--electric-cyan), 0 0 30px var(--neon-blue); }
}

@keyframes scanlineMove {
  0% { top: -10%; opacity: 1; }
  100% { top: 110%; opacity: 0; }
}

@keyframes gridFloat {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}

@keyframes modernFlash {
  0% { opacity: 0.9; transform: scale(0.8); }
  50% { opacity: 0.1; transform: scale(1.2); }
  100% { opacity: 0; transform: scale(1.5); }
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
  95% { transform: translate(-1px, 1px); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .terminal-interface {
    padding: 1rem;
  }
  
  .terminal-header {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
  
  .terminal-window {
    padding: 1rem;
    font-size: 0.9rem;
  }
  
  .ascii-art {
    font-size: 0.6rem;
  }
  
  .content-header {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .terminal-interface {
    padding: 0.5rem;
  }
  
  .terminal-window {
    padding: 0.5rem;
    font-size: 0.8rem;
  }
  
  .hexagon {
    width: 80px;
    height: 69px;
  }
  
  .boot-text {
    font-size: 0.7rem;
  }
  
  .boot-progress {
    width: 250px;
  }
}
</style>
