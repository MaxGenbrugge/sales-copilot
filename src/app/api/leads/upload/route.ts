import { NextRequest, NextResponse } from 'next/server'
import { parse } from 'papaparse'
import { createClient } from '@supabase/supabase-js'

export const POST = async (req: NextRequest) => {
  // -------- 1. Bestand ophalen --------
  const form = await req.formData()
  const file = form.get('file') as File | null
  if (!file) {
    return NextResponse.json({ error: 'Geen bestand' }, { status: 400 })
  }

  if (file.size > 50 * 1024 * 1024) {
    return NextResponse.json({ error: 'Bestand te groot (max 50MB)' }, { status: 413 })
  }

  const csv = await file.text()

  // -------- 2. CSV parsen --------
  const { data, errors } = parse(csv, { header: true, skipEmptyLines: true })
  if (errors.length) {
    return NextResponse.json({ error: 'CSV parse-fout' }, { status: 400 })
  }

  // -------- 3. Auth-token ophalen --------
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) {
    return NextResponse.json({ error: 'Geen token meegegeven' }, { status: 401 })
  }

  // -------- 4. Supabase client met token --------
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    }
  )

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Gebruiker niet herkend' }, { status: 401 })
  }

  // -------- 5. Data mappen --------
  type Row = Record<string, string>
  const leads = (data as Row[]).map(r => ({
    user_id: user.id,
    first_name: r.first_name || r.firstname || r.voornaam || null,
    last_name: r.last_name || r.lastname || r.achternaam || null,
    email: r.email?.toLowerCase() || null,
    phone: r.phone || r.phonenumber || null,
    company: r.company || r.bedrijfsnaam || null,
    job_position: r.job_position || r.position || null,
    website: r.website || null,
    language: r.language || 'nl',
    linkedin: r.linkedin || null
  }))

  // -------- 6. Bulk insert --------
  const { error: dbErr } = await supabase
    .from('leads')
    .insert(leads)
    .select('id')

  if (dbErr) {
    return NextResponse.json({ error: dbErr.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
