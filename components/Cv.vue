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
          <div class="window-controls">
            <div class="control-dot red"></div>
            <div class="control-dot yellow"></div>
            <div class="control-dot green"></div>
          </div>
          <div class="terminal-title">
            <span class="terminal-path">~/arnaud-bregere/portfolio</span>
            <div class="connection-status">
              <span class="status-indicator"></span>
              <span>CONNECTED</span>
            </div>
          </div>
        </div>

        <!-- Navigation modernisée -->
        <div class="terminal-nav">
          <Menu @navigate="handleNavigation" />
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

// Type pour les clés de section
type SectionKey =
  | "cv"
  | "experience"
  | "formation"
  | "competences"
  | "projets"
  | "contact"
  | "help";

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

  progressInterval = window.setInterval(() => {
    if (progress.value < 100) {
      progress.value += 12;
    } else {
      clearInterval(progressInterval!);
      loading.value = false;
      showContent.value = true;
      typeContent(sections[section as SectionKey]);
      playSound("https://www.orangefreesounds.com/wp-content/uploads/2021/01/Sci-fi-beep-sound-effect.mp3");
    }
  }, 80);
}

function clearScreen() {
  displayed.value = `<span class="ascii-char">${welcomeAscii}</span>`;
  contentDisplayed.value = "";
  showContent.value = false;
  showWelcome.value = true;
  index = 0;
}

function isSectionKey(key: string): key is SectionKey {
  return ["cv", "experience", "formation", "competences", "projets", "contact", "help"].includes(key);
}

onMounted(() => {
  setTimeout(() => {
    bootDone.value = true;
    showFlash.value = true;
    setTimeout(() => {
      showFlash.value = false;
      typeInitialMessage();
    }, 300);
  }, 2000);
});

onBeforeUnmount(() => {
  if (progressInterval) clearInterval(progressInterval);
});
</script>

<style scoped>
/* Variables CSS pour cohérence */
:root {
  --primary-cyan: #00ffff;
  --secondary-green: #00ff41;
  --accent-orange: #ff6b35;
  --warning-yellow: #ffff00;
  --danger-red: #ff3366;
  --bg-terminal: #0a0f14;
  --bg-darker: #000000;
  --glass-bg: rgba(10, 15, 20, 0.8);
  --border-glow: rgba(0, 255, 255, 0.5);
}

.terminal-container {
  width: 100%;
  min-height: 100vh;
  background: radial-gradient(ellipse at center, #0f1419 0%, #000000 100%);
  position: relative;
  overflow: hidden;
}

/* Boot Screen Modernisé */
.boot-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #000000 0%, #1a1a2e 50%, #16213e 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.boot-content {
  text-align: center;
  z-index: 2;
}

.boot-logo {
  margin-bottom: 2rem;
}

.hexagon {
  width: 120px;
  height: 104px;
  position: relative;
  margin: 0 auto;
}

.hexagon-inner {
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, var(--primary-cyan), var(--secondary-green));
  position: relative;
  clip-path: polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: hexagonPulse 2s ease-in-out infinite alternate;
}

.boot-text {
  color: #000;
  font-weight: bold;
  font-size: 0.9rem;
  letter-spacing: 2px;
}

.boot-progress {
  width: 300px;
  height: 4px;
  background: rgba(0, 255, 255, 0.2);
  margin: 0 auto 1rem;
  border-radius: 2px;
  overflow: hidden;
}

.boot-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-cyan), var(--secondary-green));
  width: 0;
  animation: bootProgress 2s ease-in-out infinite;
  border-radius: 2px;
  box-shadow: 0 0 10px var(--primary-cyan);
}

.boot-status {
  color: var(--primary-cyan);
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  letter-spacing: 1px;
  animation: textGlow 1s ease-in-out infinite alternate;
}

.scanline {
  position: absolute;
  width: 100%;
  height: 2px;
  background: rgba(0, 255, 255, 0.8);
  animation: scanlineMove 1.5s linear infinite;
  box-shadow: 0 0 20px var(--primary-cyan);
}

.grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: gridFloat 10s linear infinite;
  opacity: 0.3;
}

/* Flash Screen Modernisé */
.flash-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, #00ffff 0%, #000000 70%);
  z-index: 999;
  animation: modernFlash 0.3s ease-out forwards;
}

.flash-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100px;
  height: 100px;
  border: 2px solid var(--primary-cyan);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: pulseExpand 0.3s ease-out forwards;
}

/* Interface Terminal Modernisée */
.terminal-interface {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
}

.terminal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  border: 1px solid var(--border-glow);
  border-radius: 10px 10px 0 0;
  padding: 1rem 1.5rem;
  margin-bottom: 0;
}

.window-controls {
  display: flex;
  gap: 0.5rem;
}

.control-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.control-dot::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.control-dot.red {
  background: var(--danger-red);
}
.control-dot.red::before {
  box-shadow: 0 0 10px var(--danger-red);
}

.control-dot.yellow {
  background: var(--warning-yellow);
}
.control-dot.yellow::before {
  box-shadow: 0 0 10px var(--warning-yellow);
}

.control-dot.green {
  background: var(--secondary-green);
}
.control-dot.green::before {
  box-shadow: 0 0 10px var(--secondary-green);
}

.control-dot:hover::before {
  opacity: 1;
}

.terminal-title {
  display: flex;
  align-items: center;
  gap: 2rem;
  color: var(--primary-cyan);
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
  background: var(--secondary-green);
  border-radius: 50%;
  animation: statusBlink 2s ease-in-out infinite;
  box-shadow: 0 0 10px var(--secondary-green);
}

.terminal-nav {
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  border: 1px solid var(--border-glow);
  border-top: none;
  padding: 1rem;
  margin-bottom: 0;
}

.terminal-window {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-glow);
  border-top: none;
  border-radius: 0 0 10px 10px;
  padding: 2rem;
  color: var(--primary-cyan);
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
      rgba(0, 255, 255, 0.02) 2px,
      rgba(0, 255, 255, 0.02) 4px
    );
  pointer-events: none;
  z-index: 0;
}

.welcome-section {
  position: relative;
  z-index: 1;
}

.initial-message {
  color: var(--secondary-green);
  font-size: 1.1rem;
  text-shadow: 0 0 10px var(--secondary-green);
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
  background: rgba(0, 255, 255, 0.05);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 8px;
}

.hologram-effect::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, transparent, var(--primary-cyan), transparent);
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
  color: var(--accent-orange);
  text-shadow: 0 0 5px var(--accent-orange);
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
  background: rgba(0, 255, 255, 0.05);
  padding: 0.5rem;
  border-radius: 5px;
  border-left: 3px solid var(--primary-cyan);
}

.prompt-symbol {
  color: var(--secondary-green);
  font-size: 1.2rem;
  text-shadow: 0 0 10px var(--secondary-green);
}

.prompt-path {
  color: var(--primary-cyan);
  font-weight: bold;
}

.content-display {
  margin-top: 2rem;
  position: relative;
  z-index: 1;
}

.content-frame {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(0, 255, 65, 0.3);
  border-radius: 8px;
  overflow: hidden;
}

.content-header {
  background: rgba(0, 255, 65, 0.1);
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0, 255, 65, 0.3);
}

.content-title {
  color: var(--secondary-green);
  font-weight: bold;
  font-size: 1.1rem;
  text-shadow: 0 0 10px var(--secondary-green);
}

.content-timestamp {
  color: var(--primary-cyan);
  font-size: 0.8rem;
  opacity: 0.8;
}

.content-body {
  padding: 1.5rem;
}

.content-text {
  color: #a9b7c0;
  line-height: 1.6;
}

/* Styles pour le contenu typé */
:deep(.content-title-span) {
  color: var(--secondary-green);
  text-shadow: 0 0 10px var(--secondary-green);
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

:deep(.content-date-span) {
  color: var(--primary-cyan);
  text-shadow: 0 0 5px var(--primary-cyan);
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
  0% { text-shadow: 0 0 5px var(--primary-cyan); }
  100% { text-shadow: 0 0 20px var(--primary-cyan), 0 0 30px var(--primary-cyan); }
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