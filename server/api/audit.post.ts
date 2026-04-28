import { Mistral } from '@mistralai/mistralai'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { html } = body

  if (!html) {
    throw createError({ statusCode: 400, message: 'HTML manquant' })
  }

  const config = useRuntimeConfig()
  const client = new Mistral({ apiKey: config.mistralApiKey as string })

  const result = await client.chat.complete({
    model: 'mistral-small-latest',
    messages: [
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
  })

  const text = result.choices?.[0]?.message?.content

  if (!text || typeof text !== 'string') {
    throw createError({ statusCode: 500, message: 'Réponse vide de Mistral' })
  }

  try {
    const cleaned = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim()

    const parsed = JSON.parse(cleaned)

    // 🔒 sécurité minimale
    return {
      score: parsed.score ?? 0,
      resume: parsed.resume ?? '',
      violations: parsed.violations ?? [],
      htmlCorrige: parsed.htmlCorrige ?? ''
    }

  } catch (err) {
    console.error('Erreur parsing:', text)
    throw createError({
      statusCode: 500,
      message: 'Réponse invalide de Mistral'
    })
  }
})