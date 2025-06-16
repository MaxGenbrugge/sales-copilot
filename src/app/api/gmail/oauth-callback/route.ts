import { NextRequest, NextResponse } from 'next/server'
import { oauth2Client } from '@/lib/google'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: NextRequest) {
  // 1. Code & state (user_id) ophalen
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const user_id = searchParams.get('state') // user_id werd meegegeven bij auth-url

  if (!code || !user_id) {
    return NextResponse.json({ error: 'Missing code or state' }, { status: 400 })
  }

  // 2. Vraag tokens op bij Google
  const { tokens } = await oauth2Client.getToken(code)

  // 3. Supabase server-client maken met service role
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // 4. Tokens opslaan in DB
  await supabase
    .from('user_gmail_tokens')
    .upsert({
      user_id,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: new Date(tokens.expiry_date ?? Date.now() + 3600 * 1000),
    })

  // 5. Redirect terug naar dashboard
  return NextResponse.redirect(new URL('/dashboard?gmail=connected', req.url))
}
