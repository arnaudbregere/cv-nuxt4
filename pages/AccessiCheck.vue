<template>
  <div class="accessicheck">

    <!-- En-tête -->
    <header class="accessicheck__header">
      <h1>AccessiCheck</h1>
      <p>Entre une URL ou colle du HTML — l'IA analyse son accessibilité RGAA</p>
    </header>

    <!-- Agent 1 : récupération par URL -->
    <AccessiCheckUrl
      v-model:urlInput="urlInput"
      :loadingUrl="loadingUrl"
      :erreurUrl="erreurUrl"
      @fetchUrl="fetchUrl"
    />

    <!-- Zone HTML + boutons -->
    <AccessiCheckForm
      v-model:htmlInput="htmlInput"
      :loading="loading"
      :modeAutoFix="modeAutoFix"
      :iterationCourante="iterationCourante"
      :MAX_ITERATIONS="MAX_ITERATIONS"
      @analyser="analyser"
      @lancerAutoFix="lancerAutoFix"
    />

    <!-- Indicateur de chargement -->
    <p v-if="loading" class="accessicheck__loading">
      ⏳ {{ modeAutoFix ? `Itération ${iterationCourante} en cours...` : 'Analyse en cours...' }}
    </p>

    <!-- Erreur globale -->
    <p v-if="erreur" class="accessicheck__erreur">❌ {{ erreur }}</p>

    <!-- Progression des passes Auto-Fix -->
    <AccessiCheckHistorique
      :historique="historique"
      :objectifAtteint="objectifAtteint"
      :score="resultat?.score ?? 0"
      :scoreClass="scoreClass"
    />

    <!-- Résultats : score + violations + diff + fix -->
    <AccessiCheckResultats
      :resultat="resultat"
      :diffLignes="diffLignes"
      :scoreClass="scoreClass"
      @copierHtmlCorrige="copierHtmlCorrige"
      @generatePDF="generatePDF"
    />

  </div>
</template>

<script setup lang="ts">
// Toute la logique reste dans le composable — la page orchestre uniquement
import { useAccessiCheck } from '~/composables/useAccessiCheck'

const {
  urlInput, htmlInput, loading, loadingUrl,
  modeAutoFix, iterationCourante, MAX_ITERATIONS,
  erreur, erreurUrl, resultat, historique, objectifAtteint,
  diffLignes,
  fetchUrl, analyser, lancerAutoFix,
  copierHtmlCorrige, generatePDF, scoreClass
} = useAccessiCheck()
</script>

<style lang="scss">
@use '~/assets/scss/accessicheck/accessicheck';
</style>