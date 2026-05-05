<template>
  <!-- Visible seulement si Auto-Fix avec 2+ passes -->
  <div v-if="historique.length > 1" class="accessicheck__historique">
    <h2>📈 Progression de l'agent</h2>

    <div class="historique__steps">
      <div
        v-for="step in historique"
        :key="step.iteration"
        class="historique__step"
        :class="scoreClass(step.score)"
      >
        <span class="step__label">Passe {{ step.iteration }}</span>
        <span class="step__score">{{ step.score }}/100</span>
        <span v-if="step.score >= 80" class="step__badge">✅</span>
      </div>
    </div>

    <p v-if="objectifAtteint" class="historique__success">
      ✅ Score ≥ 80 atteint en {{ historique.length }} itération(s)
    </p>
    <p v-else class="historique__partial">
      ℹ️ Score maximum atteint après {{ historique.length }} passe(s) : {{ score }}/100
    </p>
  </div>
</template>

<script setup lang="ts">
import type { IterationStep } from '~/composables/useAccessiCheck'

// Composant purement affichage — aucune logique métier
defineProps<{
  historique:     IterationStep[]
  objectifAtteint: boolean
  score:          number
  scoreClass:     (score: number) => string
}>()
</script>