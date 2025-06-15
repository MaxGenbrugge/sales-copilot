import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { transporter } from '@/lib/gmail'
import { generateMailPrompt } from '@/lib/openai'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export const POST = async (req: NextRequest) => {
  // 1. Auth
  const {
    data: { user },
    error: authErr
  } = await supabase.auth.getUser(
    req.headers.get('authorization')?.replace('Bearer ', '') || ''
  )
  if (authErr || !user)
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })

  // 2. Fetch leads (max. 100)
  const { data: leads, error } = await supabase
    .from('leads')
    .select('*')
    .eq('user_id', user.id)
    .limit(100)

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 })

  // 3. Loop + retries (simple)
  for (const lead of leads) {
    try {
      const body = await generateMailPrompt(lead)

      await transporter.sendMail({
        from: process.env.GMAIL_SENDER_EMAIL,
        to: lead.email,
        subject: `Voor ${lead.first_name ?? lead.company}: bespaar tijd met automatisatie`,
        text: body
      })
    } catch (err) {
      console.error('Send failed, will retry later', err)
      // → hier kun je naar een queue schrijven of exponential backoff toepassen
    }
  }

  return NextResponse.json({ sent: leads.length })
}
