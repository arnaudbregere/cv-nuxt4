import { createClient, callLLM, cleanJSON } from '../services/mistral.service'
import type { AuditResult, CriticResult } from '../types/audit.types'

// Valide et filtre les violations générées par runAudit
export const runCritic = async (
  html:   string,
  audit:  AuditResult,
  apiKey: string
): Promise<CriticResult> => {
  const client = createClient(apiKey)

  const messages = [
    {
      role: 'system',
      content: `
Tu es un expert en accessibilité web (RGAA 4.1, WCAG 2.1).

On te donne :
1. Un HTML
2. Une liste de violations générées par une IA

Ta mission :
- Supprimer les violations FAUSSES
- Corriger celles imprécises
- Garder uniquement les pertinentes

IMPORTANT :
- Sois STRICT (mieux vaut supprimer que inventer)
- Ne rajoute PAS de nouvelles violations

Retourne UNIQUEMENT ce JSON :

{
  "violationsValides": [
    {
      "critere": "...",
      "niveau": "A",
      "description": "...",
      "element": "...",
      "correction": "..."
    }
  ],
  "violationsCorrigees": [
    {
      "critere": "...",
      "niveau": "A",
      "description": "...",
      "element": "...",
      "correction": "..."
    }
  ]
}
`
    },
    {
      role: 'user',
      content: `
HTML :
${html.slice(0, 6000)}

AUDIT :
${JSON.stringify(audit.violations, null, 2)}
`
    }
  ]

  try {
    const text = await callLLM(client, messages)
    const parsed = JSON.parse(cleanJSON(text))

    return {
      violationsValides: parsed.violationsValides ?? [],
      violationsCorrigees: parsed.violationsCorrigees ?? []
    }

  } catch (err) {
    console.error('Erreur runCritic:', err)

    // Fallback : on garde les violations brutes plutôt que de planter
    return {
      violationsValides: audit.violations,
      violationsCorrigees: []
    }
  }
}