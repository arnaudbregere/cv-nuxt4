<template>
  <div class="accessicheck">

    <!-- En-tête -->
    <header class="accessicheck__header">
      <h1>AccessiCheck</h1>
      <p>Entre une URL ou colle du HTML — l'IA analyse son accessibilité RGAA</p>
    </header>

    <!-- ── Agent 1 : récupération par URL ── -->
    <div class="accessicheck__url">
      <input
        v-model="urlInput"
        type="url"
        placeholder="https://exemple.fr"
        :disabled="loadingUrl"
      />
      <!-- Guard null : on désactive si urlInput est vide ou vaut la string "null" -->
      <button :disabled="loadingUrl || !urlInput || urlInput === 'null'" @click="fetchUrl">
        {{ loadingUrl ? 'Récupération...' : '🌐 Récupérer le HTML' }}
      </button>
      <p v-if="erreurUrl" class="accessicheck__erreur">❌ {{ erreurUrl }}</p>
    </div>

    <!-- ── Zone HTML + boutons d'action ── -->
    <div class="accessicheck__form">
      <textarea
        v-model="htmlInput"
        placeholder="Colle ton HTML ici..."
        rows="10"
      />

      <div class="accessicheck__modes">
        <!-- Audit simple : 1 appel Mistral, résultat immédiat -->
        <button
          class="btn-analyser"
          :disabled="loading || !htmlInput"
          @click="analyser"
        >
          {{ loading && !modeAutoFix ? 'Analyse en cours...' : '🔍 Analyser' }}
        </button>

        <!-- Auto-Fix : Mistral se corrige lui-même jusqu'à score ≥ 80 (max 3 passes) -->
        <button
          class="btn-autofix"
          :disabled="loading || !htmlInput"
          @click="lancerAutoFix"
        >
          {{ loading && modeAutoFix ? `Itération ${iterationCourante}/${MAX_ITERATIONS}...` : '🤖 Mode Auto-Fix' }}
        </button>
      </div>

      <p class="accessicheck__hint">
        <strong>Auto-Fix</strong> : l'IA corrige le HTML puis ré-analyse jusqu'à score ≥ 80 (max 3 passes)
      </p>
    </div>

    <!-- ── Indicateur de chargement ── -->
    <p v-if="loading" class="accessicheck__loading">
      ⏳ {{ modeAutoFix ? `Itération ${iterationCourante} en cours...` : 'Analyse en cours...' }}
    </p>

    <!-- ── Erreur globale ── -->
    <p v-if="erreur" class="accessicheck__erreur">❌ {{ erreur }}</p>

    <!-- ── Historique des passes (visible seulement si Auto-Fix avec 2+ passes) ── -->
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
        ℹ️ Score maximum atteint après {{ historique.length }} passe(s) : {{ resultat?.score }}/100
      </p>
    </div>

    <!-- ── Résultats ── -->
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

      <!-- HTML corrigé + actions -->
      <div v-if="resultat.htmlCorrige" class="accessicheck__fix">
        <h2>✨ HTML corrigé automatiquement</h2>
        <textarea :value="resultat.htmlCorrige" rows="10" readonly />
        <div class="accessicheck__fix-actions">
          <button @click="copierHtmlCorrige">📋 Copier le HTML corrigé</button>
          <button class="btn-pdf" @click="generatePDF">⬇️ Télécharger le rapport PDF</button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
// Toute la logique est dans le composable — ce fichier ne fait qu'afficher
import { useAccessiCheck } from '~/composables/useAccessiCheck'

const {
  urlInput, htmlInput, loading, loadingUrl,
  modeAutoFix, iterationCourante, MAX_ITERATIONS,
  erreur, erreurUrl, resultat, historique, objectifAtteint,
  fetchUrl, analyser, lancerAutoFix,
  copierHtmlCorrige, generatePDF, scoreClass
} = useAccessiCheck()
</script>

<style lang="scss">
// On importe le fichier SCSS externe plutôt que d'écrire les styles ici
@use '~/assets/scss/accessicheck/accessicheck';
</style>