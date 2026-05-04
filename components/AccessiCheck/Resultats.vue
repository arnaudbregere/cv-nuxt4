<template>
  <div v-if="resultat" class="accessicheck__resultats">

    <!-- Score coloré -->
    <div class="accessicheck__score" :class="scoreClass(resultat.score)">
      <span class="score-chiffre">{{ resultat.score }}/100</span>
      <span class="score-label">Score accessibilité</span>
    </div>

    <p class="accessicheck__resume">{{ resultat.resume }}</p>

    <!-- Cas zéro violation -->
    <div v-if="resultat.violations.length === 0" class="accessicheck__ok">
      ✅ Aucun problème détecté !
    </div>

    <!-- Liste des violations -->
    <ul v-else class="accessicheck__violations">
      <li
        v-for="(v, index) in resultat.violations"
        :key="index"
        class="violation"
        :class="`violation--${v.niveau.toLowerCase()}`"
      >
        <div class="violation__header">
          <span class="violation__niveau">Niveau {{ v.niveau }}</span>
          <strong class="violation__critere">{{ v.critere }}</strong>
        </div>
        <p class="violation__description">{{ v.description }}</p>
        <code class="violation__element">{{ v.element }}</code>
        <p class="violation__correction">
          <span>✅ Correction :</span> {{ v.correction }}
        </p>
      </li>
    </ul>

    <!-- ── Diff avant / après ──────────────────────────────────────────────
         Chaque ligne colorée selon son type :
           - supprimée (rouge)  → ce que l'agent a retiré
           - ajoutée   (vert)   → ce que l'agent a ajouté
           - inchangée (neutre) → contexte
    -->
    <div v-if="diffLignes.length > 0" class="accessicheck__diff">
      <h2>🔀 Ce que l'agent a modifié</h2>
      <div class="diff__legende">
        <span class="diff__badge diff__badge--supprime">− Avant</span>
        <span class="diff__badge diff__badge--ajoute">+ Après</span>
      </div>
      <div class="diff__viewer">
        <div
          v-for="(ligne, i) in diffLignes"
          :key="i"
          class="diff__ligne"
          :class="`diff__ligne--${ligne.type}`"
        >
          <!-- Préfixe visuel : − pour supprimé, + pour ajouté, espace sinon -->
          <span class="diff__prefix">
            {{ ligne.type === 'supprime' ? '−' : ligne.type === 'ajoute' ? '+' : ' ' }}
          </span>
          <code class="diff__code">{{ ligne.texte }}</code>
        </div>
      </div>
    </div>

    <!-- HTML corrigé + actions -->
    <div v-if="resultat.htmlCorrige" class="accessicheck__fix">
      <h2>✨ HTML corrigé automatiquement</h2>
      <textarea :value="resultat.htmlCorrige" rows="10" readonly />
      <div class="accessicheck__fix-actions">
        <button @click="$emit('copierHtmlCorrige')">📋 Copier le HTML corrigé</button>
        <button class="btn-pdf" @click="$emit('generatePDF')">⬇️ Télécharger le rapport PDF</button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import type { AuditResultat, DiffLigne } from '~/composables/useAccessiCheck'

// Composant purement affichage — aucune logique métier
defineProps<{
  resultat:   AuditResultat | null
  diffLignes: DiffLigne[]
  scoreClass: (score: number) => string
}>()

defineEmits<{
  'copierHtmlCorrige': []
  'generatePDF':       []
}>()
</script>