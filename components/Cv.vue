<template>
  <div class="terminal-container">
    <!-- Boot écran + scanline -->
    <template v-if="!bootDone">
      <div class="boot-screen">
        <div class="scanline"></div>
      </div>
    </template>

    <!-- Flash avant affichage terminal -->
    <template v-else-if="showFlash">
      <div class="flash-screen"></div>
    </template>

    <!-- Terminal après boot et flash -->
    <template v-else>
      <div class="terminal-nav">
        <Menu @navigate="handleNavigation" />
      </div>
      <div class="terminal-window">
        <!-- Message initial -->
        <pre class="whitespace-pre-wrap">{{ initialMessage }}</pre>

        <!-- ASCII art de bienvenue -->
        <pre v-if="showWelcome" class="whitespace-pre-wrap welcome-text" v-html="displayed"></pre>

        <!-- Prompt -->
        <TerminalPrompt v-model:command="command" @enter="handleEnter" />

        <!-- Progress bar -->
        <ProgressBar :loading="loading" :progress="progress" :section="currentSection" />

        <!-- Contenu affiché -->
        <div v-if="showContent" class="mt-4">
          <pre class="whitespace-pre-wrap content-text" v-html="contentDisplayed"></pre>
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

function playSound(url: string) {
  const audio = new Audio(url);
  audio.volume = 0.3; // Volume plus bas
  audio.play().catch(() => {
    // Fallback silencieux si le son ne peut pas être lu
    console.log("Son non disponible");
  });
}

function typeInitialMessage() {
  const text = "> Appuyez sur la touche Entrée pour démarrer...";
  if (index < text.length) {
    initialMessage.value += text[index];
    index++;
    setTimeout(typeInitialMessage, 25);
  } else {
    index = 0;
  }
}

function typeASCII() {
  if (index < welcomeAscii.length) {
    const char = welcomeAscii[index];
    displayed.value += `<span style="color:orange;">${char}</span>`;
    index++;
    setTimeout(typeASCII, 10); // Plus rapide
  } else {
    index = 0;
  }
}

function typeContent(text: string) {
  contentDisplayed.value = "";
  contentIndex = 0;

  // Fonction pour transformer les classes en styles inline
  function applyInlineStyles(input: string): string {
    return input
      .replace(/<span class="title"/g, '<span style="color: #00ff00; text-shadow: 0 0 10px #00ff00, 0 0 15px #ff8800; font-weight: bold; margin-bottom: 0.5rem;"')
      .replace(/<span class="date"/g, '<span style="color: #00ffff; text-shadow: 0 0 5px #00ffff; font-style: italic; margin-left: 1rem;"')
  }

  const styledText = applyInlineStyles(text);

  function type() {
    if (contentIndex < styledText.length) {
      contentDisplayed.value += styledText[contentIndex];
      contentIndex++;
      setTimeout(type, 5); // Très rapide pour une meilleure UX
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
    displayed.value += `\nCommande reconnue: "${cmd}"... Chargement...\n`;
    startLoading(cmd);
  } else {
    displayed.value += `\nCommande inconnue: "${enteredCommand}". Tapez 'help' pour voir les commandes disponibles.\n`;
  }
  command.value = "";
}

function handleNavigation(section: string) {
  if (sections[section as SectionKey]) {
    currentSection.value = section as SectionKey;
    displayed.value += `\nNavigation vers ${section}... Chargement...\n`;
    startLoading(section as SectionKey);
  }
}

function startLoading(section: string) {
  loading.value = true;
  progress.value = 0;
  if (progressInterval) clearInterval(progressInterval);

  progressInterval = window.setInterval(() => {
    if (progress.value < 100) {
      progress.value += 10; // Plus rapide
    } else {
      clearInterval(progressInterval!);
      loading.value = false;
      showContent.value = true;
      typeContent(sections[section as SectionKey]);
      playSound("https://www.orangefreesounds.com/wp-content/uploads/2021/01/Sci-fi-beep-sound-effect.mp3");
    }
  }, 100);
}

function clearScreen() {
  displayed.value = `<span style="color:orange;">${welcomeAscii}</span>`; // Afficher l'ASCII art immédiatement
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
    }, 200);
  }, 3000);
});

onBeforeUnmount(() => {
  if (progressInterval) clearInterval(progressInterval);
});
</script>

<style scoped>
.terminal-container {
  width: 100%;
  max-width: 100rem;
  min-height: 100vh;
  background: #000;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 1rem;
  overflow-x: auto;
  
  /* Responsive */
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
}

/* Boot écran style Alien */
.boot-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.boot-screen::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(0,255,0,0.2) 0%, rgba(0,0,0,1) 70%);
  animation: flicker 0.5s linear forwards;
}

.scanline {
  position: absolute;
  width: 100%;
  height: 4px;
  background: rgba(0, 255, 0, 0.8);
  animation: scan 3s linear infinite;
}

@keyframes scan {
  0% { top: -10%; }
  100% { top: 110%; }
}

@keyframes flicker {
  0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; }
  20%, 24%, 55% { opacity: 0; }
}

/* Flash rapide */
.flash-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #b0ffb0;
  opacity: 0.9;
  animation: flash 0.2s linear forwards;
  z-index: 999;
}

@keyframes flash {
  0% { opacity: 0.9; }
  50% { opacity: 0.1; }
  100% { opacity: 0; }
}

/* Terminal classique */
.terminal-window, .terminal-nav {
  background: #0a0f0a;
  color: #00ff00;
  font-family: "Courier New", monospace;
  line-height: 1.5;
  padding: 1rem 1.5rem;
  border: 2px solid #00ff00;
  text-align: left;
  font-size: 1rem;
  
  /* Responsive */
  @media (max-width: 768px) {
    padding: 0.5rem;
    font-size: 0.8rem;
    border: 1px solid #00ff00;
  }
  
  @media (max-width: 480px) {
    font-size: 0.7rem;
  }
}

.terminal-window {
  min-height: 70vh;
  
  @media (max-width: 768px) {
    min-height: 60vh;
  }
}

.terminal-nav {
  min-height: auto;
  margin-bottom: 1rem;
}

/* Styles spécifiques pour le contenu */
.welcome-text {
  line-height: 1.2;
  color: #00ff00;
  text-shadow: 0 0 5px #00ff00, 0 0 10px #00ff00;
  
  @media (max-width: 768px) {
    line-height: 1.1;
  }
}

.content-text {
  color: #a9b7c0;
}

.mt-4 {
  margin-top: 1rem;
}

.whitespace-pre-wrap {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>