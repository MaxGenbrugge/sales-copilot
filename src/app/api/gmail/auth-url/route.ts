import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { generateAuthUrl } from '@/lib/google'
import { headers } from 'next/headers'

/** Kleine helper om cookies te lezen uit de headers */
function getCookie(name: string, cookieHeader: string): string | undefined {
  const match = cookieHeader.match(
    new RegExp('(?:^|; )' + name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') + '=([^;]*)')
  )
  return match ? decodeURIComponent(match[1]) : undefined
}

export async function GET() {
  // 1. Cookies ophalen uit headers
  const cookieHeader = (await headers()).get('cookie') ?? ''

  // 2. Supabase-client maken met cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => getCookie(name, cookieHeader),
      },
    }
  )

  // 3. Veilige user ophalen (getUser contacteert de Supabase server)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  }

  // 4. Redirect naar Google OAuth met user_id als state
  const url = generateAuthUrl(user.id)
  return NextResponse.redirect(url, 307)
}
