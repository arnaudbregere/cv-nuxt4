import { runAudit, type AuditResult } from '../utils/runAudit'
import { runCritic } from '../agents/runCritic'

const SCORE_CIBLE  = 80   // on s'arrête quand le score dépasse ce seuil
const MAX_ITERATIONS = 3  // sécurité anti-boucle infinie


// La forme d'une étape dans l'historique.
// Chaque fois que l'agent fait une passe, on crée un objet de cette forme pour garder une trace
export interface IterationStep {
  iteration:   number
  score:       number
  resume:      string
  violations:  AuditResult['violations']
  htmlCorrige: string
}


// C'est la syntaxe Nuxt pour créer un endpoint API.
// defineEventHandler dit à Nuxt "quand quelqu'un appelle cette route, exécute cette fonction".
// C'est l'équivalent d'un @click mais côté serveur.

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { html } = body

  // On lit ce que le front a envoyé dans le POST. Si le HTML est absent, on renvoie une erreur 400
  if (!html) {
    throw createError({ statusCode: 400, message: 'HTML manquant' })
  }

  const config = useRuntimeConfig()
  const apiKey = config.mistralApiKey as string


/* On initialise les trois variables qui vont évoluer pendant la boucle :

historique → le tableau vide qui va se remplir à chaque passe
htmlCourant → le HTML qu'on analyse. Il va changer à chaque itération (c'est le cœur de l'agent)
tentative → le compteur de passes */
  const historique: IterationStep[] = []
  let htmlCourant = html
  let tentative   = 0

  // ─── Boucle agentique ────────────────────────────────────────────────────
  while (tentative < MAX_ITERATIONS) {
    tentative++

    let resultat: AuditResult

    try {
      // Agent 1 — Audit : analyse le HTML et génère les violations brutes
      // La première fois c'est le HTML original.
      // Les fois suivantes, c'est le HTML corrigé par Mistral lui-même.
      resultat = await runAudit(htmlCourant, apiKey)
    } catch (err) {
      console.error(`Erreur runAudit à l'itération ${tentative} :`, err)
      throw createError({ statusCode: 500, message: `Erreur Mistral à l'itération ${tentative}` })
    }

    // Agent 2 — Critic : valide et filtre les violations brutes de l'audit
    // AVANT ce patch : les violations hallucinées par Mistral faussaient le score
    // et pouvaient déclencher des itérations inutiles ("chasser des fantômes").
    // APRÈS ce patch : seules les violations réelles influencent le score et l'historique.
    let violationsValidees: AuditResult['violations']

    try {
      const critic = await runCritic(htmlCourant, resultat, apiKey)
      violationsValidees = [
        ...critic.violationsValides,
        ...critic.violationsCorrigees
      ]
    } catch (err) {
      // Si le critic échoue, on garde les violations brutes plutôt que de planter
      console.error(`Erreur runCritic à l'itération ${tentative} :`, err)
      violationsValidees = resultat.violations
    }

    // On enregistre la photo de cette passe dans l'historique,
    // avec les violations validées (pas les brutes)
    historique.push({
      iteration:   tentative,
      score:       resultat.score,
      resume:      resultat.resume,
      violations:  violationsValidees, // ← corrigé : violations filtrées par le critic
      htmlCorrige: resultat.htmlCorrige
    })

    // Critère d'arrêt : score suffisant OU plus de HTML corrigé à exploiter
    if (resultat.score >= SCORE_CIBLE || !resultat.htmlCorrige) {
      break
    }

    // L'agent se nourrit de sa propre sortie pour la prochaine passe.
    // C'est la ligne la plus importante de tout le fichier :
    // la sortie d'un tour devient l'entrée du tour suivant.
    htmlCourant = resultat.htmlCorrige
  }
  // ─────────────────────────────────────────────────────────────────────────

  // Une fois la boucle terminée, on renvoie tout au front :
  // historique → toutes les passes (pour afficher la progression)
  // objectifAtteint → booléen simple pour que le front sache si on a atteint 80+
  const dernierResultat = historique[historique.length - 1]
  if (!dernierResultat) throw createError({ statusCode: 500, message: 'Aucune itération complétée' })


  return {
    historique,
    score:           dernierResultat.score,
    resume:          dernierResultat.resume,
    violations:      dernierResultat.violations,
    htmlCorrige:     dernierResultat.htmlCorrige,
    iterations:      tentative,
    objectifAtteint: dernierResultat.score >= SCORE_CIBLE
  }
})