<template>
  <div class="accessicheck__form">
    <textarea
      :value="htmlInput"
      placeholder="Colle ton HTML ici..."
      rows="10"
      @input="$emit('update:htmlInput', ($event.target as HTMLTextAreaElement).value)"
    />

    <div class="accessicheck__modes">
      <!-- Audit simple : 1 appel Mistral, résultat immédiat -->
      <button
        class="btn-analyser"
        :disabled="loading || !htmlInput"
        @click="$emit('analyser')"
      >
        {{ loading && !modeAutoFix ? 'Analyse en cours...' : '🔍 Analyser' }}
      </button>

      <!-- Auto-Fix : Mistral se corrige lui-même jusqu'à score ≥ 80 (max 3 passes) -->
      <button
        class="btn-autofix"
        :disabled="loading || !htmlInput"
        @click="$emit('lancerAutoFix')"
      >
        {{ loading && modeAutoFix
          ? `Itération ${iterationCourante}/${MAX_ITERATIONS}...`
          : '🤖 Mode Auto-Fix'
        }}
      </button>
    </div>

    <p class="accessicheck__hint">
      <strong>Auto-Fix</strong> : l'IA corrige le HTML puis ré-analyse jusqu'à score ≥ 80 (max 3 passes)
    </p>
  </div>
</template>

<script setup lang="ts">
// Composant purement affichage — aucune logique métier
defineProps<{
  htmlInput:        string
  loading:          boolean
  modeAutoFix:      boolean
  iterationCourante: number
  MAX_ITERATIONS:   number
}>()

defineEmits<{
  'update:htmlInput': [val: string]
  'analyser':         []
  'lancerAutoFix':    []
}>()
</script>