// server/api/fetch-url.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { url } = body

  if (!url) {
    throw createError({ statusCode: 400, message: 'URL manquante' })
  }

  // Validation basique de l'URL
  try {
    new URL(url)
  } catch {
    throw createError({ statusCode: 400, message: 'URL invalide' })
  }

  try {
    const response = await fetch(url, {
      headers: {
        // On se présente pour éviter les blocages bot
        'User-Agent': 'Mozilla/5.0 (compatible; AccessiCheck/1.0)'
      }
    })

    if (!response.ok) {
      throw createError({
        statusCode: 502,
        message: `Impossible de récupérer la page (statut ${response.status})`
      })
    }

    const contentType = response.headers.get('content-type') ?? ''
    if (!contentType.includes('text/html')) {
      throw createError({
        statusCode: 400,
        message: "L'URL ne pointe pas vers une page HTML"
      })
    }

    const html = await response.text()
    return { html }

  } catch (err: any) {
    // On laisse passer les erreurs createError déjà formatées
    if (err.statusCode) throw err
    throw createError({ statusCode: 502, message: 'Erreur réseau lors de la récupération' })
  }
})