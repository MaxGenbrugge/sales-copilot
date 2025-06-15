import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function generateMailPrompt(lead: {
  first_name: string | null
  last_name: string | null
  company: string | null
  language: string | null
}) {
  const name = [lead.first_name, lead.last_name].filter(Boolean).join(' ')
  const lang = lead.language ?? 'nl'

  const { choices } = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are an expert Dutch sales copywriter. Write concise friendly emails.`
      },
      {
        role: 'user',
        content: `Schrijf een vriendelijke sales-e-mail van max. 200 woorden in ${lang} aan ${name || 'een prospect'} bij ${lead.company}. Product: onze SaaS-oplossing die hun verkoopproces automatiseert. Leg kort twee voordelen uit en sluit af met een duidelijke call-to-action.`
      }
    ]
  })

  const content = choices[0]?.message.content?.trim()
if (!content) throw new Error('Geen e-mailinhoud gegenereerd')
return content
}
