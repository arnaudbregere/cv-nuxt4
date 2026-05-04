import { Mistral } from '@mistralai/mistralai'

// crée la connexion avec l'API Mistral
export function createClient(apiKey: string) {
  return new Mistral({ apiKey })
}

// envoie le message à Mistral et récupère la réponse
export async function callLLM(client: Mistral, messages: any[]) {
  const res = await client.chat.complete({
    model:       'mistral-small-latest',
    temperature: 0, // ← ajout : stabilise les scores
    messages
  })

  const content = res.choices?.[0]?.message?.content

  if (!content || typeof content !== 'string') {
    throw new Error('Réponse vide LLM')
  }

  return content
}

// nettoie la réponse de Mistral pour qu'elle soit du JSON propre
// (Mistral ajoute parfois des ```json qui cassent le parsing)
export function cleanJSON(text: string) {
  return text
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim()
}