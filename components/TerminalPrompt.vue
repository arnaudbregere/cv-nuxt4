<template>
  <div @keydown="handleKey" class="prompt-input">
    <span>{{ props.command }}</span>
    <span class="cursor">█</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  command: string;
}>();

const emit = defineEmits(["update:command", "enter"]);

// Historique des commandes
const commandHistory = ref<string[]>([]);
const historyIndex = ref(-1); // -1 signifie aucune commande de l'historique sélectionnée

function handleKey(e: KeyboardEvent) {
  e.preventDefault(); // Empêche le comportement par défaut pour toutes les touches gérées

  if (e.key === " " || e.code === "Space") {
    emit("update:command", props.command + " ");
    return;
  }

  if (e.key === "Enter") {
    if (props.command.trim()) {
      // Ajouter la commande à l'historique si elle n'est pas vide
      commandHistory.value.unshift(props.command);
      // Limiter l'historique à 50 commandes pour éviter une croissance infinie
      if (commandHistory.value.length > 50) {
        commandHistory.value.pop();
      }
      historyIndex.value = -1; // Réinitialiser l'index après une nouvelle commande
    }
    emit("enter", props.command);
    emit("update:command", ""); // Vide après validation
  } else if (e.key === "Backspace") {
    emit("update:command", props.command.slice(0, -1));
  } else if (e.key === "ArrowUp") {
    // Gérer la flèche du haut pour récupérer la commande précédente
    if (commandHistory.value.length > 0 && historyIndex.value < commandHistory.value.length - 1) {
      historyIndex.value++;
      emit("update:command", commandHistory.value[historyIndex.value]);
    }
  } else if (e.key.length === 1) {
    emit("update:command", props.command + e.key);
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleKey);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKey);
});
</script>

<style scoped lang="scss">

.terminal-container {
  background: var(--bg-darker);
  padding: 0.5rem; 

  @include respond-to(tablet) {
    padding: 0.8rem;
  }

  @include respond-to(desktop) {
    padding: 1.5rem;
  }
}

.terminal-window {
  background: var(--bg-darker);
  color: var(--electric-cyan);
  font-family: "Courier New", monospace;
  font-size: 0.85rem; 
  line-height: 1.5;
  width: 100%;
  padding: 0.5rem; 
  border: .2rem solid var(--border-glow);
  box-shadow: 0 0 1.5rem var(--neon-blue);
  text-align: left;
  overflow-y: auto;
  overflow-x: auto;
  max-height: 50vh; 
  white-space: pre-wrap;
  word-wrap: break-word;

  @include respond-to(tablet) {
    padding: 0.8rem;
    font-size: 0.9rem;
    max-height: 60vh;
  }

  @include respond-to(desktop) {
    padding: 1rem;
    font-size: 1rem;
    max-height: 70vh;
  }
}

.cursor {
  display: inline-block;
  width: 0.8rem;
  background: var(--neon-blue);
  margin-left: .2rem;
  animation: blink 1s step-start infinite;

  @include respond-to(tablet) {
    width: 1rem;
  }
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}
.prompt-input {
  display: flex;
  align-items: center;
}

.cursor {
  display: inline-block;
  width: .6rem; 
  margin-left: .2rem;
  animation: blink 1s step-start infinite;
  color: var(--neon-blue);
  text-shadow: 0 0 .5rem var(--electric-cyan);
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}


@include respond-to(tablet) {
  .cursor {
    width: .8rem;
  }
}
</style>
