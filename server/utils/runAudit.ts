
import { createClient, callLLM, cleanJSON } from "../services/mistral.service"


// On définit la forme des données 
// — ce que TypeScript appelle une interface.
// C'est juste un contrat qui dit "une Violation aura toujours un critere, un niveau, une description...".
// Le mot export veut dire "les autres fichiers peuvent aussi utiliser ces types", ce qui évite de les réécrire partout.
export interface Violation {
  critere: string
  niveau: 'A' | 'AA' | 'AAA'
  description: string
  element: string
  correction: string
}

export interface AuditResult {
  score: number
  resume: string
  violations: Violation[]
  htmlCorrige: string
}

/* prend du HTML en entrée (ce qu'on veut analyser)
prend la clé API Mistral en entrée (pour s'authentifier)
retourne une promesse d'AuditResult (= un résultat qui arrivera dans le futur, car l'appel réseau prend du temps) */
export async function runAudit(html: string, apiKey: string): Promise<AuditResult> {
   // On crée la connexion avec Mistral en lui donnant la clé API. C'est comme "ouvrir la ligne" avant de parler.
  const client = createClient(apiKey)


  // le prompt envoyé à Mistral, exactement comme tu avais dans ton ancien audit.post.ts.
  // Rien de nouveau ici — c'est juste déplacé dans ce fichier utilitaire.
  // Le .slice(0, 8000) tronque le HTML à 8000 caractères pour ne pas dépasser la limite du modèle.
  const messages = [
    {
      role: 'system',
      content: `Tu es un expert en accessibilité web (WCAG 2.1, RGAA 4.1).
Analyse le HTML et retourne UNIQUEMENT un JSON valide :
{
  "score": 75,
  "resume": "Résumé en 2 phrases.",
  "violations": [
    {
      "critere": "Nom du critère RGAA",
      "niveau": "A",
      "description": "Ce qui ne va pas",
      "element": "élément HTML",
      "correction": "Correction"
    }
  ],
  "htmlCorrige": "<html corrigé avec améliorations accessibilité>"
}`
    },
    {
      role: 'user',
      content: `Analyse ce HTML :\n\n${html.slice(0, 8000)}`
    }
  ]

/* callLLM envoie les messages à Mistral et attend la réponse (d'où le await)
cleanJSON enlève les éventuels ``` ou espaces parasites
JSON.parse transforme le texte brut en objet JavaScript manipulable */
  const text = await callLLM(client, messages)
  const parsed = JSON.parse(cleanJSON(text))


  //On retourne un objet propre.
  // Le ?? 0 veut dire "si Mistral n'a pas renvoyé ce champ, utilise cette valeur par défaut" 
  // — c'est une sécurité au cas où Mistral hallucine un JSON incomplet.
  return {
    score:       parsed.score       ?? 0,
    resume:      parsed.resume      ?? '',
    violations:  parsed.violations  ?? [],
    htmlCorrige: parsed.htmlCorrige ?? ''
  }
}