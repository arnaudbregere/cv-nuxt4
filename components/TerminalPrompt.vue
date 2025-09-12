<template>
  <div @keydown="handleKey">
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

<style scoped>
.cursor {
  display: inline-block;
  width: 10px;
  background: #00ff00;
  margin-left: 2px;
  animation: blink 1s step-start infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}
</style>