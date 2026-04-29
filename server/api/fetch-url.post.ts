import { parse } from 'node-html-parser'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { url } = body

  if (!url) {
    throw createError({ statusCode: 400, message: 'URL manquante' })
  }

  try {
    new URL(url)
  } catch {
    throw createError({ statusCode: 400, message: 'URL invalide' })
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AccessiCheck/1.0)'
      }
    })

    // Option 1 — message d'erreur explicite selon le type de blocage
    if (!response.ok) {
      const isAntiBot = response.status === 999
        || response.status === 403
        || response.status === 401

      throw createError({
        statusCode: 502,
        message: isAntiBot
          ? `Ce site bloque les requêtes automatiques (statut ${response.status}). Colle le HTML manuellement via Ctrl+U.`
          : `Impossible de récupérer la page (statut ${response.status})`
      })
    }

    const contentType = response.headers.get('content-type') ?? ''
    if (!contentType.includes('text/html')) {
      throw createError({
        statusCode: 400,
        message: "L'URL ne pointe pas vers une page HTML"
      })
    }

    const raw = await response.text()

    // Option 2 — nettoyage du HTML avec node-html-parser
    const root = parse(raw)

    // On supprime tout ce qui ne sert pas à l'analyse accessibilité
    root.querySelectorAll('script, style, link, meta, noscript, svg').forEach(el => el.remove())

    // On cible le <body> uniquement (là où est le vrai contenu)
    const body = root.querySelector('body')
    const html = body ? body.innerHTML.trim() : root.innerHTML.trim()

    // Sécurité : on tronque à 8000 caractères (limite du prompt Mistral)
    return { html: html.slice(0, 8000) }

  } catch (err: any) {
    if (err.statusCode) throw err
    throw createError({ statusCode: 502, message: 'Erreur réseau lors de la récupération' })
  }
})