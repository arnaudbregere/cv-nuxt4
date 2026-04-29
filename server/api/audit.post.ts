// server/api/audit.post.ts
import { createClient, callLLM, cleanJSON } from '../utils/mistral'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { html } = body

  if (!html) {
    throw createError({ statusCode: 400, message: 'HTML manquant' })
  }

  const config = useRuntimeConfig()
  const client = createClient(config.mistralApiKey as string)

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

  try {
    const text = await callLLM(client, messages)
    const parsed = JSON.parse(cleanJSON(text))

    return {
      score: parsed.score ?? 0,
      resume: parsed.resume ?? '',
      violations: parsed.violations ?? [],
      htmlCorrige: parsed.htmlCorrige ?? ''
    }
  } catch (err) {
    console.error('Erreur parsing Mistral:', err)
    throw createError({ statusCode: 500, message: 'Réponse invalide de Mistral' })
  }
})