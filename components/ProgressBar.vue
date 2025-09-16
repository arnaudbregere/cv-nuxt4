<template>
  <div v-if="loading" class="mt-4">
    <p>Chargement de {{ formattedSection }}...</p>
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
.progress-bar {
  width: 100%;
  border: 1px solid #00ff00;
  height: 20px;
  margin-top: 0.5rem;
  position: relative;
  background: #000;
}

.progress {
  height: 100%;
  background: #00ff00;
  box-shadow: 0 0 10px #00ff00;
  transition: width 0.15s linear;
}
</style>