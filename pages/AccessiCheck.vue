<template>
  <div class="accessicheck">
    <header class="accessicheck__header">
      <h1>AccessiCheck</h1>
      <p>Colle du HTML ci-dessous — l'IA analyse son accessibilité RGAA</p>
    </header>

    <div class="accessicheck__form">
      <textarea
        v-model="htmlInput"
        placeholder="Colle ton HTML ici..."
        rows="10"
      />
      <button :disabled="loading || !htmlInput" @click="analyser">
        {{ loading ? 'Analyse en cours...' : 'Analyser' }}
      </button>
    </div>

    <p v-if="loading" class="accessicheck__loading">
      ⏳ Analyse en cours...
    </p>

    <p v-if="erreur" class="accessicheck__erreur">
      ❌ {{ erreur }}
    </p>

    <div v-if="resultat" class="accessicheck__resultats">

      <div class="accessicheck__score" :class="scoreClass">
        <span class="score-chiffre">{{ resultat.score }}/100</span>
        <span class="score-label">Score accessibilité</span>
      </div>

      <p class="accessicheck__resume">{{ resultat.resume }}</p>

      <div v-if="resultat.violations.length === 0" class="accessicheck__ok">
        ✅ Aucun problème détecté !
      </div>

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

      <!-- 🔥 NOUVELLE FEATURE -->
      <div v-if="resultat.htmlCorrige" class="accessicheck__fix">
        <h2>✨ HTML corrigé automatiquement</h2>

        <textarea
          :value="resultat.htmlCorrige"
          rows="10"
          readonly
        />

        <button @click="copierHtmlCorrige">
          Copier le HTML corrigé
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
interface Violation {
  critere: string
  niveau: 'A' | 'AA' | 'AAA'
  description: string
  element: string
  correction: string
}

interface AuditResultat {
  score: number
  resume: string
  violations: Violation[]
  htmlCorrige: string
}

const htmlInput = ref('')
const loading = ref(false)
const erreur = ref('')
const resultat = ref<AuditResultat | null>(null)

const scoreClass = computed(() => {
  if (!resultat.value) return ''
  if (resultat.value.score >= 80) return 'score--vert'
  if (resultat.value.score >= 50) return 'score--orange'
  return 'score--rouge'
})

async function analyser() {
  loading.value = true
  erreur.value = ''
  resultat.value = null

  try {
    const data = await $fetch<AuditResultat>('/api/audit', {
      method: 'POST',
      body: { html: htmlInput.value }
    })
    resultat.value = data
  } catch (e: unknown) {
    erreur.value = 'Une erreur est survenue. Réessaie.'
    console.error(e)
  } finally {
    loading.value = false
  }
}

function copierHtmlCorrige() {
  if (resultat.value?.htmlCorrige) {
    navigator.clipboard.writeText(resultat.value.htmlCorrige)
  }
}
</script>

<style lang="scss" scoped>
.accessicheck {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;

  &__header {
    margin-bottom: 2rem;
    h1 { font-size: 2rem; margin-bottom: 0.5rem; }
    p { color: #666; }
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;

    textarea {
      width: 100%;
      padding: 1rem;
      border: 2px solid #ddd;
      border-radius: 8px;
      font-family: monospace;
      font-size: 0.9rem;
      resize: vertical;
      &:focus { outline: none; border-color: #0066cc; }
    }

    button {
      align-self: flex-start;
      padding: 0.75rem 2rem;
      background: #0066cc;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
      &:disabled { opacity: 0.5; cursor: not-allowed; }
      &:hover:not(:disabled) { background: #0052a3; }
    }
  }

  &__loading { color: #666; font-style: italic; }
  &__erreur { color: #cc0000; }

  &__score {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    padding: 1.5rem 2rem;
    border-radius: 12px;
    margin-bottom: 1rem;

    .score-chiffre { font-size: 3rem; font-weight: bold; line-height: 1; }
    .score-label { font-size: 0.85rem; opacity: 0.8; }

    &.score--vert   { background: #e6f4ea; color: #1a7a3f; }
    &.score--orange { background: #fff3e0; color: #e65100; }
    &.score--rouge  { background: #fce8e6; color: #c62828; }
  }

  &__resume { margin: 1rem 0 2rem; color: #444; line-height: 1.6; }
  &__ok { padding: 1rem; background: #e6f4ea; border-radius: 8px; color: #1a7a3f; }

  &__violations {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
}

.violation {
  padding: 1rem 1.25rem;
  border-radius: 8px;
  border-left: 4px solid;

  &--a   { background: #fce8e6; border-color: #c62828; }
  &--aa  { background: #fff3e0; border-color: #e65100; }
  &--aaa { background: #e8f0fe; border-color: #1a73e8; }

  &__header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
  }

  &__niveau {
    font-size: 0.75rem;
    font-weight: bold;
    padding: 0.2rem 0.5rem;
    background: rgba(0,0,0,0.1);
    border-radius: 4px;
  }

  &__description { margin: 0.5rem 0; color: #444; }

  &__element {
    display: block;
    padding: 0.5rem;
    background: rgba(0,0,0,0.06);
    border-radius: 4px;
    font-size: 0.85rem;
    margin: 0.5rem 0;
    word-break: break-all;
  }

  &__correction {
    margin: 0.5rem 0 0;
    span { font-weight: bold; }
  }
}

.accessicheck__fix {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  textarea {
    width: 100%;
    font-family: monospace;
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid #ddd;
  }

  button {
    align-self: flex-start;
    padding: 0.5rem 1.5rem;
    background: #1a7a3f;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }
}
</style>