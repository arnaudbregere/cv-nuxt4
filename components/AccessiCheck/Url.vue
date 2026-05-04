<template>
  <div class="accessicheck__url">
    <input
      :value="urlInput"
      type="url"
      placeholder="https://exemple.fr"
      :disabled="loadingUrl"
      @input="$emit('update:urlInput', ($event.target as HTMLInputElement).value)"
    />
    <button :disabled="loadingUrl || !urlInput" @click="$emit('fetchUrl')">
      {{ loadingUrl ? 'Récupération...' : '🌐 Récupérer le HTML' }}
    </button>
    <p v-if="erreurUrl" class="accessicheck__erreur">❌ {{ erreurUrl }}</p>
  </div>
</template>

<script setup lang="ts">
// Composant purement affichage — aucune logique métier
// Toute la logique reste dans useAccessiCheck (composable parent)
defineProps<{
  urlInput:   string
  loadingUrl: boolean
  erreurUrl:  string
}>()

defineEmits<{
  'update:urlInput': [val: string]
  'fetchUrl':        []
}>()
</script>