<template>
  <div v-if="loading" class="mt-4">
    <p>Chargement du CV...</p>
    <div class="progress-bar">
      <div class="progress" :style="{ width: progress + '%' }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, watch } from "vue";

const props = defineProps<{
  loading: boolean;
  progress: number;
}>();

const loading = ref(props.loading);
const progress = ref(props.progress);

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