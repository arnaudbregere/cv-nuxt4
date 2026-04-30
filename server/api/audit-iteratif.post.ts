
import { runAudit, type AuditResult } from '../utils/runAudit'

const SCORE_CIBLE  = 80   // on s'arrête quand le score dépasse ce seuil
const MAX_ITERATIONS = 3  // sécurité anti-boucle infinie


// La forme d'une étape dans l'historique.
// Chaque fois que l'agent fait une passe, on crée un objet de cette forme pour garder une trace
export interface IterationStep {
  iteration:  number
  score:      number
  resume:     string
  violations: AuditResult['violations']
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

  const config   = useRuntimeConfig()
  const apiKey   = config.mistralApiKey as string


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
        // On envoie le HTML à Mistral et on attend la réponse. La première fois c'est le HTML original.
        // Les fois suivantes, c'est le HTML corrigé par Mistral lui-même.
      resultat = await runAudit(htmlCourant, apiKey)
    } catch (err) {
      console.error(`Erreur à l'itération ${tentative} :`, err)
      throw createError({ statusCode: 500, message: `Erreur Mistral à l'itération ${tentative}` })
    }

    // On enregistre l'état de cette itération
    //On enregistre la photo de cette passe dans l'historique.
    // C'est ce que le front affichera dans les petites cases "Passe 1 → 62/100, Passe 2 → 78/100...".
    historique.push({
      iteration:   tentative,
      score:       resultat.score,
      resume:      resultat.resume,
      violations:  resultat.violations,
      htmlCorrige: resultat.htmlCorrige
    })

    // Critère d'arrêt : score suffisant OU plus de HTML corrigé à exploiter
    if (resultat.score >= SCORE_CIBLE || !resultat.htmlCorrige) {
      break
    }

    // L'agent se nourrit de sa propre sortie pour la prochaine passe
    //C'est la ligne la plus importante de tout le fichier.
    // L'agent remplace le HTML d'entrée par le HTML corrigé que Mistral vient de produire.
    // À la prochaine itération, Mistral va analyser sa propre correction.
    // C'est ça, le mode agentique : la sortie d'un tour devient l'entrée du tour suivant.
    htmlCourant = resultat.htmlCorrige
  }
  // ─────────────────────────────────────────────────────────────────────────


/*   Une fois la boucle terminée, on renvoie tout au front :

historique → toutes les passes (pour afficher la progression)
le score/violations/htmlCorrigé de la dernière passe
objectifAtteint → un booléen simple pour que le front sache si on a atteint 80+ */
  const dernierResultat = historique[historique.length - 1]

  return {
    historique,                          // toutes les étapes pour l'UI
    score:       dernierResultat.score,
    resume:      dernierResultat.resume,
    violations:  dernierResultat.violations,
    htmlCorrige: dernierResultat.htmlCorrige,
    iterations:  tentative,
    objectifAtteint: dernierResultat.score >= SCORE_CIBLE
  }
})