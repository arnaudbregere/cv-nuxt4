import { Mistral } from '@mistralai/mistralai'

// Ouvre la connexion avec l'API Mistral
export const createClient = (apiKey: string) =>
  new Mistral({ apiKey })

// Envoie les messages à Mistral et récupère la réponse texte
export const callLLM = async (client: Mistral, messages: any[]): Promise<string> => {
  const res = await client.chat.complete({
    model:       'mistral-small-latest',
    temperature: 0,
    messages
  })

  const content = res.choices?.[0]?.message?.content

  if (!content || typeof content !== 'string') {
    throw new Error('Réponse vide LLM')
  }

  return content
}

// Nettoie les backticks que Mistral ajoute parfois autour du JSON
export const cleanJSON = (text: string): string =>
  text
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim()