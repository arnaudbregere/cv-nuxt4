import { Mistral } from '@mistralai/mistralai'

export function createClient(apiKey: string) {
  return new Mistral({ apiKey })
}

export async function callLLM(client: Mistral, messages: any[]) {
  const res = await client.chat.complete({
    model: 'mistral-small-latest',
    messages
  })

  const content = res.choices?.[0]?.message?.content

  if (!content || typeof content !== 'string') {
    throw new Error('Réponse vide LLM')
  }

  return content
}

export function cleanJSON(text: string) {
  return text
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim()
}