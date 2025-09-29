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

<style scoped lang="scss">

.progress-bar {
  width: 100%;
  border: .1rem solid var(--neon-blue);
  height: 1.4rem; 
  margin-top: 0.5rem;
  position: relative;
  background: var(--bg-darker);

  @include respond-to(tablet) {
    height: 1.6rem;
  }

  @include respond-to(desktop) {
    height: 1.8rem;
  }
}

.progress {
  height: 100%;
  background: var(--neon-blue);
  box-shadow: 0 0 1rem var(--electric-cyan);
  transition: width 0.15s linear;
}
.loading-text {
  color: var(--electric-cyan);
  font-family: 'Courier New', monospace;
  font-size: 0.85rem; 
  text-align: center;
  margin-bottom: 0.5rem;
}

.progress-bar {
  width: 100%;
  border: .1rem solid var(--neon-blue);
  height: 1.2rem;
  margin: 0 auto;
  position: relative;
  background: var(--bg-darker);
  border-radius: .5rem;
}

.progress {
  height: 100%;
  background: var(--neon-blue);
  box-shadow: 0 0 .8rem var(--electric-cyan);
  transition: width 0.15s linear;
  border-radius: .5rem;
}

/* Tablet */
@include respond-to(tablet) {
  .loading-text {
    font-size: 0.9rem;
  }
  .progress-bar {
    height: 1.4rem;
  }
}

/* Desktop */
@include respond-to(desktop) {
  .loading-text {
    font-size: 1rem;
  }
  .progress-bar {
    height: 1.5rem;
  }
}
</style>
