<template>
  <div class="accessicheck">
    <header class="accessicheck__header">
      <h1>AccessiCheck</h1>
      <p>Entre une URL ou colle du HTML — l'IA analyse son accessibilité RGAA</p>
    </header>

    <!-- Agent 1 : champ URL -->
    <div class="accessicheck__url">
      <input
        v-model="urlInput"
        type="url"
        placeholder="https://exemple.fr"
        :disabled="loadingUrl"
      />
      <button :disabled="loadingUrl || !urlInput" @click="fetchUrl">
        {{ loadingUrl ? 'Récupération...' : '🌐 Récupérer le HTML' }}
      </button>
      <p v-if="erreurUrl" class="accessicheck__erreur">❌ {{ erreurUrl }}</p>
    </div>

    <div class="accessicheck__form">
      <textarea
        v-model="htmlInput"
        placeholder="Colle ton HTML ici..."
        rows="10"
      />

      <!-- Choix du mode -->
      <div class="accessicheck__modes">
        <button
          :disabled="loading || !htmlInput"
          class="btn-analyser"
          @click="analyser"
        >
          {{ loading && !modeAutoFix ? 'Analyse en cours...' : '🔍 Analyser' }}
        </button>

        <button
          :disabled="loading || !htmlInput"
          class="btn-autofix"
          @click="lancerAutoFix"
        >
          {{ loading && modeAutoFix ? `Itération ${iterationCourante}/${MAX_ITERATIONS}...` : '🤖 Mode Auto-Fix' }}
        </button>
      </div>

      <p class="accessicheck__hint">
        <strong>Auto-Fix</strong> : l'IA corrige le HTML puis ré-analyse jusqu'à score ≥ 80 (max 3 passes)
      </p>
    </div>

    <p v-if="loading" class="accessicheck__loading">
      ⏳ {{ modeAutoFix ? `Itération ${iterationCourante} en cours...` : 'Analyse en cours...' }}
    </p>

    <p v-if="erreur" class="accessicheck__erreur">❌ {{ erreur }}</p>

    <!-- ── Historique des itérations (mode Auto-Fix) ── -->
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
          <span class="step__badge" v-if="step.score >= 80">✅ Objectif atteint</span>
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

      <div class="accessicheck__score" :class="scoreClass(resultat.score)">
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

interface IterationStep {
  iteration:   number
  score:       number
  resume:      string
  violations:  Violation[]
  htmlCorrige: string
}

const MAX_ITERATIONS = 3

const urlInput        = ref('')
const htmlInput       = ref('')
const loading         = ref(false)
const loadingUrl      = ref(false)
const modeAutoFix     = ref(false)
const iterationCourante = ref(0)
const erreur          = ref('')
const erreurUrl       = ref('')
const resultat        = ref<AuditResultat | null>(null)
const historique      = ref<IterationStep[]>([])
const objectifAtteint = ref(false)

// ── scoreClass accepte maintenant un score en paramètre ──
function scoreClass(score: number): string {
  if (score >= 80) return 'score--vert'
  if (score >= 50) return 'score--orange'
  return 'score--rouge'
}

// Agent 1 : récupère le HTML depuis une URL
async function fetchUrl() {
  loadingUrl.value = true
  erreurUrl.value  = ''
  htmlInput.value  = ''

  try {
    const data = await $fetch<{ html: string }>('/api/fetch-url', {
      method: 'POST',
      body: { url: urlInput.value }
    })
    htmlInput.value = data.html
  } catch (e: any) {
    erreurUrl.value = e?.data?.message ?? 'Impossible de récupérer la page.'
  } finally {
    loadingUrl.value = false
  }
}

// Agent 2 : audit simple (inchangé)
async function analyser() {
  loading.value    = true
  modeAutoFix.value = false
  erreur.value     = ''
  resultat.value   = null
  historique.value = []

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

// Agent 4 : boucle agentique Auto-Fix ✨
async function lancerAutoFix() {
  loading.value         = true
  modeAutoFix.value     = true
  erreur.value          = ''
  resultat.value        = null
  historique.value      = []
  objectifAtteint.value = false
  iterationCourante.value = 0

  try {
    // On simule l'avancement côté UI via polling de l'itération
    // (le serveur fait tout d'un coup, on met à jour avant l'appel)
    iterationCourante.value = 1

    const data = await $fetch<{
      historique:      IterationStep[]
      score:           number
      resume:          string
      violations:      Violation[]
      htmlCorrige:     string
      iterations:      number
      objectifAtteint: boolean
    }>('/api/audit-iteratif', {
      method: 'POST',
      body: { html: htmlInput.value }
    })

    historique.value      = data.historique
    objectifAtteint.value = data.objectifAtteint
    iterationCourante.value = data.iterations

    // Le résultat affiché = dernière itération
    resultat.value = {
      score:       data.score,
      resume:      data.resume,
      violations:  data.violations,
      htmlCorrige: data.htmlCorrige
    }
  } catch (e: unknown) {
    erreur.value = 'Une erreur est survenue pendant l\'Auto-Fix. Réessaie.'
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

// Import dynamique pour éviter les erreurs SSR Nuxt
async function generatePDF() {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF()

  const date = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric'
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 15
  const maxWidth = pageWidth - margin * 2
  let y = 20

  function addText(text: string, x: number, size: number, style: 'normal' | 'bold' = 'normal', color: [number, number, number] = [0, 0, 0]) {
    doc.setFontSize(size)
    doc.setFont('helvetica', style)
    doc.setTextColor(...color)
    const lines = doc.splitTextToSize(text, maxWidth)
    lines.forEach((line: string) => {
      if (y > 270) { doc.addPage(); y = 20 }
      doc.text(line, x, y)
      y += size * 0.5
    })
    y += 3
  }

  function addSeparator(color: [number, number, number] = [200, 200, 200]) {
    if (y > 270) { doc.addPage(); y = 20 }
    doc.setDrawColor(...color)
    doc.line(margin, y, pageWidth - margin, y)
    y += 6
  }

  addText('AccessiCheck — Rapport d\'audit RGAA', margin, 18, 'bold', [0, 102, 204])
  addText(`Date : ${date}`, margin, 10, 'normal', [100, 100, 100])
  if (urlInput.value) {
    addText(`URL analysée : ${urlInput.value}`, margin, 10, 'normal', [100, 100, 100])
  }
  if (historique.value.length > 1) {
    addText(`Mode Auto-Fix : ${historique.value.length} itération(s)`, margin, 10, 'normal', [100, 100, 100])
  }
  y += 4
  addSeparator([0, 102, 204])

  const score = resultat.value!.score
  const scoreColor: [number, number, number] = score >= 80 ? [26, 122, 63] : score >= 50 ? [230, 81, 0] : [198, 40, 40]

  addText(`Score accessibilité : ${score}/100`, margin, 16, 'bold', scoreColor)
  addText(resultat.value!.resume, margin, 11, 'normal', [68, 68, 68])

  // Historique dans le PDF
  if (historique.value.length > 1) {
    y += 4
    addSeparator()
    addText('Progression de l\'agent', margin, 13, 'bold')
    historique.value.forEach(step => {
      addText(`Passe ${step.iteration} → Score : ${step.score}/100`, margin + 4, 10, 'normal', [68, 68, 68])
    })
  }

  y += 4
  addSeparator()

  if (resultat.value!.violations.length === 0) {
    addText('✅ Aucun problème détecté !', margin, 12, 'bold', [26, 122, 63])
  } else {
    addText(`Violations détectées (${resultat.value!.violations.length})`, margin, 13, 'bold')
    y += 2
    resultat.value!.violations.forEach((v, i) => {
      if (y > 260) { doc.addPage(); y = 20 }
      const niveauColor: [number, number, number] = v.niveau === 'A' ? [198, 40, 40] : v.niveau === 'AA' ? [230, 81, 0] : [26, 101, 232]
      addText(`${i + 1}. [Niveau ${v.niveau}] ${v.critere}`, margin, 11, 'bold', niveauColor)
      addText(`Description : ${v.description}`, margin + 4, 10, 'normal', [68, 68, 68])
      addText(`Élément : ${v.element}`, margin + 4, 9, 'normal', [80, 80, 80])
      addText(`Correction : ${v.correction}`, margin + 4, 10, 'normal', [26, 122, 63])
      y += 3
    })
  }

  addSeparator()

  if (resultat.value!.htmlCorrige) {
    addText('HTML corrigé (annexe)', margin, 13, 'bold')
    addText(resultat.value!.htmlCorrige.slice(0, 1500), margin, 8, 'normal', [80, 80, 80])
  }

  const totalPages = (doc.internal as any).getNumberOfPages()
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(`AccessiCheck — ${date} — Page ${p}/${totalPages}`, margin, 290)
  }

  const filename = urlInput.value
    ? `audit-${new URL(urlInput.value).hostname}-${Date.now()}.pdf`
    : `audit-accessicheck-${Date.now()}.pdf`

  doc.save(filename)
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

  &__url {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    align-items: flex-start;
    margin-bottom: 1.5rem;

    input {
      flex: 1;
      min-width: 200px;
      padding: 0.75rem 1rem;
      border: 2px solid #ddd;
      border-radius: 8px;
      font-size: 1rem;
      &:focus { outline: none; border-color: #0066cc; }
      &:disabled { opacity: 0.5; }
    }

    button {
      padding: 0.75rem 1.5rem;
      background: #6200ea;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
      white-space: nowrap;
      &:disabled { opacity: 0.5; cursor: not-allowed; }
      &:hover:not(:disabled) { background: #4a00b4; }
    }
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
  }

  &__modes {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  &__hint {
    font-size: 0.85rem;
    color: #888;
    margin-top: -0.5rem;
  }

  &__loading { color: #666; font-style: italic; }
  &__erreur  { color: #cc0000; }

  &__score {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    padding: 1.5rem 2rem;
    border-radius: 12px;
    margin-bottom: 1rem;

    .score-chiffre { font-size: 3rem; font-weight: bold; line-height: 1; }
    .score-label   { font-size: 0.85rem; opacity: 0.8; }

    &.score--vert   { background: #e6f4ea; color: #1a7a3f; }
    &.score--orange { background: #fff3e0; color: #e65100; }
    &.score--rouge  { background: #fce8e6; color: #c62828; }
  }

  &__resume { margin: 1rem 0 2rem; color: #444; line-height: 1.6; }
  &__ok     { padding: 1rem; background: #e6f4ea; border-radius: 8px; color: #1a7a3f; }

  &__violations {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  // ── Historique Auto-Fix ──
  &__historique {
    background: #f8f9ff;
    border: 1px solid #d0d7ff;
    border-radius: 12px;
    padding: 1.25rem 1.5rem;
    margin-bottom: 2rem;

    h2 { font-size: 1.1rem; margin-bottom: 1rem; }
  }
}

.historique {
  &__steps {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    margin-bottom: 0.75rem;
  }

  &__step {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    min-width: 90px;
    font-size: 0.85rem;

    &.score--vert   { background: #e6f4ea; color: #1a7a3f; }
    &.score--orange { background: #fff3e0; color: #e65100; }
    &.score--rouge  { background: #fce8e6; color: #c62828; }
  }

  &__success { color: #1a7a3f; font-weight: bold; }
  &__partial { color: #666; }
}

.step {
  &__label  { font-size: 0.75rem; opacity: 0.8; }
  &__score  { font-size: 1.25rem; font-weight: bold; }
  &__badge  { font-size: 0.7rem; margin-top: 0.25rem; }
}

.btn-analyser {
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

.btn-autofix {
  padding: 0.75rem 2rem;
  background: #6200ea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  &:disabled { opacity: 0.5; cursor: not-allowed; }
  &:hover:not(:disabled) { background: #4a00b4; }
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
}

.accessicheck__fix-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;

  button {
    padding: 0.5rem 1.5rem;
    background: #1a7a3f;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.95rem;
    &:hover { background: #145c30; }
  }

  .btn-pdf {
    background: #c62828;
    &:hover { background: #9b1e1e; }
  }
}
</style>