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

function handleKey(e: KeyboardEvent) {
  if (e.key === " " || e.code === "Space") {
    e.preventDefault();
    emit("update:command", props.command + " ");
    return;
  }

  if (e.key === "Enter") {
    e.preventDefault();
    emit("enter", props.command);
    emit("update:command", ""); // Vide après validation
  } else if (e.key === "Backspace") {
    e.preventDefault();
    emit("update:command", props.command.slice(0, -1));
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
