'use client'

import { useEffect, useState } from 'react'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'

type Lead = {
  id: string
  first_name: string | null
  last_name: string | null
  email: string | null
  company: string | null
  job_position: string | null
  phone: string | null
}

export default function LeadsList() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const session = useSession()
  const supabase = useSupabaseClient()

  useEffect(() => {
    const fetchLeads = async () => {
      if (!session) return

      const { data, error } = await supabase
        .from('leads')
        .select('id, first_name, last_name, email, company, job_position, phone')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Leads ophalen mislukt:', error.message)
      } else {
        setLeads(data)
      }

      setLoading(false)
    }

    fetchLeads()
  }, [session, supabase])

  if (loading) return <p>🔄 Leads laden...</p>
  if (leads.length === 0) return <p>ℹ️ Je hebt nog geen leads.</p>

  return (
    <div className="mt-6">
      <h3 className="font-semibold mb-2">🧾 Jouw leads</h3>
      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-2">Naam</th>
            <th className="text-left p-2">E-mail</th>
            <th className="text-left p-2">Bedrijf</th>
            <th className="text-left p-2">Functie</th>
            <th className="text-left p-2">Telefoon</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="border-t">
              <td className="p-2">{lead.first_name} {lead.last_name}</td>
              <td className="p-2">{lead.email}</td>
              <td className="p-2">{lead.company}</td>
              <td className="p-2">{lead.job_position}</td>
              <td className="p-2">{lead.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
