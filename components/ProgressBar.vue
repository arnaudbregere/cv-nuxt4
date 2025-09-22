<template>
  <div v-if="loading" class="mt-2">
    <p class="loading-text">Chargement de {{ formattedSection }}...</p>
    <div class="progress-bar">
      <div class="progress" :style="{ width: progress + '%' }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  loading: boolean;
  progress: number;
  section: string;
}>();

const loading = ref(props.loading);
const progress = ref(props.progress);

// Formater la section pour un affichage convivial
const formattedSection = computed(() => {
  const sectionMap: { [key: string]: string } = {
    cv: "CV",
    experience: "Expériences",
    formation: "Formation",
    competences: "Compétences",
    projets: "Projets",
    contact: "Contact",
    help: "Aide",
  };
  return sectionMap[props.section.toLowerCase()] || props.section;
});

watch(() => props.loading, (newLoading) => {
  loading.value = newLoading;
});

watch(() => props.progress, (newProgress) => {
  progress.value = newProgress;
});
</script>

<style scoped>
.loading-text {
  color: var(--electric-cyan);
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  text-align: center;
  margin-bottom: 0.5rem;
}

.progress-bar {
  width: 100%;
  border: 1px solid var(--neon-blue);
  height: 15px;
  margin: 0 auto;
  position: relative;
  background: var(--bg-darker);
  border-radius: 5px;
}

.progress {
  height: 100%;
  background: var(--neon-blue);
  box-shadow: 0 0 8px var(--electric-cyan);
  transition: width 0.15s linear;
  border-radius: 5px;
}

/* Améliorations mobile */
@media (max-width: 768px) {
  .loading-text {
    font-size: 0.9rem;
  }

  .progress-bar {
    height: 14px;
  }
}

@media (max-width: 480px) {
  .loading-text {
    font-size: 0.85rem;
  }

  .progress-bar {
    height: 12px;
  }
}
</style>