
// Toute la logique métier d'AccessiCheck : état, appels API, PDF

import type { Ref } from 'vue'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Violation {
  critere:     string
  niveau:      'A' | 'AA' | 'AAA'
  description: string
  element:     string
  correction:  string
}

export interface AuditResultat {
  score:       number
  resume:      string
  violations:  Violation[]
  htmlCorrige: string
}

export interface IterationStep {
  iteration:   number
  score:       number
  resume:      string
  violations:  Violation[]
  htmlCorrige: string
}

// ─── Constantes ───────────────────────────────────────────────────────────────

export const MAX_ITERATIONS = 3
export const SCORE_CIBLE    = 80

// ─── Composable ───────────────────────────────────────────────────────────────

export function useAccessiCheck() {

  // -- État global -------------------------------------------------------------

  const urlInput          = ref('')
  const htmlInput         = ref('')
  const loading           = ref(false)
  const loadingUrl        = ref(false)
  const modeAutoFix       = ref(false)
  const iterationCourante = ref(0)
  const erreur            = ref('')
  const erreurUrl         = ref('')
  const resultat          = ref<AuditResultat | null>(null)
  const historique        = ref<IterationStep[]>([])
  const objectifAtteint   = ref(false)

  // -- Helpers -----------------------------------------------------------------

  // Garde défensive : si urlInput reçoit null (ex: SSR, query param vide),
  // on remet une chaîne vide pour éviter l'affichage de "null" dans l'input
  watch(urlInput, val => {
    if (val === 'null' || val === null) urlInput.value = ''
  })

  /** Retourne la classe CSS de couleur selon le score (rouge / orange / vert) */
  function scoreClass(score: number): string {
    if (score >= SCORE_CIBLE) return 'score--vert'
    if (score >= 50)          return 'score--orange'
    return 'score--rouge'
  }

  /** Remet tout à zéro avant chaque nouvelle analyse */
  function resetEtat() {
    erreur.value          = ''
    resultat.value        = null
    historique.value      = []
    objectifAtteint.value = false
    iterationCourante.value = 0
  }

  // -- Agent 1 : fetch URL -----------------------------------------------------

  /** Récupère le HTML d'une URL via le serveur Nuxt */
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

  // -- Agent 2 : audit simple --------------------------------------------------

  /** Analyse le HTML une seule fois (1 appel Mistral) */
  async function analyser() {
    resetEtat()
    loading.value     = true
    modeAutoFix.value = false

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

  // -- Agent 4 : boucle agentique Auto-Fix -------------------------------------

  /** Lance la boucle itérative : Mistral se corrige lui-même jusqu'à score ≥ 80 */
  async function lancerAutoFix() {
    resetEtat()
    loading.value           = true
    modeAutoFix.value       = true
    iterationCourante.value = 1 // on affiche "Itération 1..." tout de suite pour l'UX

    try {
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

      // On hydrate toutes les variables réactives avec la réponse du serveur
      historique.value        = data.historique
      objectifAtteint.value   = data.objectifAtteint
      iterationCourante.value = data.iterations

      resultat.value = {
        score:       data.score,
        resume:      data.resume,
        violations:  data.violations,
        htmlCorrige: data.htmlCorrige
      }
    } catch (e: unknown) {
      erreur.value = "Une erreur est survenue pendant l'Auto-Fix. Réessaie."
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  // -- Actions UI --------------------------------------------------------------

  /** Copie le HTML corrigé dans le presse-papier */
  function copierHtmlCorrige() {
    if (resultat.value?.htmlCorrige) {
      navigator.clipboard.writeText(resultat.value.htmlCorrige)
    }
  }

  // -- Génération PDF ----------------------------------------------------------

  /**
   * Génère et télécharge un rapport PDF avec :
   * - le score et le résumé
   * - l'historique Auto-Fix si plusieurs passes
   * - la liste des violations
   * - le HTML corrigé en annexe
   */
  async function generatePDF() {
    const { jsPDF } = await import('jspdf') // import dynamique = pas de problème SSR Nuxt

    const doc  = new jsPDF()
    const date = new Date().toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'long', year: 'numeric'
    })

    const pageWidth = doc.internal.pageSize.getWidth()
    const margin    = 15
    const maxWidth  = pageWidth - margin * 2
    let y           = 20 // position verticale courante sur la page

    // Utilitaire : ajoute du texte avec retour à la ligne et gestion multi-page
    function addText(
      text:  string,
      x:     number,
      size:  number,
      style: 'normal' | 'bold' = 'normal',
      color: [number, number, number] = [0, 0, 0]
    ) {
      doc.setFontSize(size)
      doc.setFont('helvetica', style)
      doc.setTextColor(...color)
      const lines = doc.splitTextToSize(text, maxWidth)
      lines.forEach((line: string) => {
        if (y > 270) { doc.addPage(); y = 20 } // nouvelle page si on déborde
        doc.text(line, x, y)
        y += size * 0.5
      })
      y += 3
    }

    // Utilitaire : ligne de séparation horizontale
    function addSeparator(color: [number, number, number] = [200, 200, 200]) {
      if (y > 270) { doc.addPage(); y = 20 }
      doc.setDrawColor(...color)
      doc.line(margin, y, pageWidth - margin, y)
      y += 6
    }

    // En-tête
    addText("AccessiCheck — Rapport d'audit RGAA", margin, 18, 'bold', [0, 102, 204])
    addText(`Date : ${date}`, margin, 10, 'normal', [100, 100, 100])
    if (urlInput.value) {
      addText(`URL analysée : ${urlInput.value}`, margin, 10, 'normal', [100, 100, 100])
    }
    if (historique.value.length > 1) {
      addText(`Mode Auto-Fix : ${historique.value.length} itération(s)`, margin, 10, 'normal', [100, 100, 100])
    }
    y += 4
    addSeparator([0, 102, 204])

    // Score
    const score       = resultat.value!.score
    const scoreColor: [number, number, number] = score >= 80
      ? [26, 122, 63]
      : score >= 50 ? [230, 81, 0] : [198, 40, 40]

    addText(`Score accessibilité : ${score}/100`, margin, 16, 'bold', scoreColor)
    addText(resultat.value!.resume, margin, 11, 'normal', [68, 68, 68])

    // Historique Auto-Fix dans le PDF
    if (historique.value.length > 1) {
      y += 4
      addSeparator()
      addText("Progression de l'agent", margin, 13, 'bold')
      historique.value.forEach(step => {
        addText(`Passe ${step.iteration} → Score : ${step.score}/100`, margin + 4, 10, 'normal', [68, 68, 68])
      })
    }

    y += 4
    addSeparator()

    // Violations
    if (resultat.value!.violations.length === 0) {
      addText('✅ Aucun problème détecté !', margin, 12, 'bold', [26, 122, 63])
    } else {
      addText(`Violations détectées (${resultat.value!.violations.length})`, margin, 13, 'bold')
      y += 2
      resultat.value!.violations.forEach((v, i) => {
        if (y > 260) { doc.addPage(); y = 20 }
        const niveauColor: [number, number, number] = v.niveau === 'A'
          ? [198, 40, 40]
          : v.niveau === 'AA' ? [230, 81, 0] : [26, 101, 232]
        addText(`${i + 1}. [Niveau ${v.niveau}] ${v.critere}`, margin, 11, 'bold', niveauColor)
        addText(`Description : ${v.description}`, margin + 4, 10, 'normal', [68, 68, 68])
        addText(`Élément : ${v.element}`,          margin + 4,  9, 'normal', [80, 80, 80])
        addText(`Correction : ${v.correction}`,    margin + 4, 10, 'normal', [26, 122, 63])
        y += 3
      })
    }

    addSeparator()

    // Annexe : HTML corrigé (tronqué à 1500 car le PDF a ses limites)
    if (resultat.value!.htmlCorrige) {
      addText('HTML corrigé (annexe)', margin, 13, 'bold')
      addText(resultat.value!.htmlCorrige.slice(0, 1500), margin, 8, 'normal', [80, 80, 80])
    }

    // Pied de page sur chaque page
    const totalPages = (doc.internal as any).getNumberOfPages()
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p)
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text(`AccessiCheck — ${date} — Page ${p}/${totalPages}`, margin, 290)
    }

    // Téléchargement
    const filename = urlInput.value
      ? `audit-${new URL(urlInput.value).hostname}-${Date.now()}.pdf`
      : `audit-accessicheck-${Date.now()}.pdf`

    doc.save(filename)
  }

  // ─── On expose uniquement ce dont le template a besoin ───────────────────────
  return {
    // État
    urlInput, htmlInput, loading, loadingUrl,
    modeAutoFix, iterationCourante, MAX_ITERATIONS,
    erreur, erreurUrl, resultat, historique, objectifAtteint,
    // Fonctions
    fetchUrl, analyser, lancerAutoFix,
    copierHtmlCorrige, generatePDF, scoreClass
  }
}