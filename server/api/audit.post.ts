// Déléguation

import { runAudit } from '../utils/runAudit'


// appelle runAudit, attend le résultat, et le renvoie au front.
// Le comportement est exactement identique à avant — on a juste rangé le code dans un tiroir séparé pour pouvoir le réutiliser dans l'agent itératif.
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { html } = body

  if (!html) {
    throw createError({ statusCode: 400, message: 'HTML manquant' })
  }

  const config = useRuntimeConfig()

  try {
    const resultat = await runAudit(html, config.mistralApiKey as string)
    return resultat
  } catch (err) {
    console.error('Erreur audit:', err)
    throw createError({ statusCode: 500, message: 'Réponse invalide de Mistral' })
  }
})