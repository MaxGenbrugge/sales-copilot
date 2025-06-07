'use client'

import { useEffect, useState } from 'react'
import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react'

// ✅ Type voor één lead
type Lead = {
  id: number
  name: string
  email: string
  score: number
  user_id: string
}

export default function LeadsList() {
  const supabase = useSupabaseClient()
  const session = useSession()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeads = async () => {
      if (!session) return
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', session.user.id)
        .order('score', { ascending: false })

      if (!error) setLeads((data as Lead[]) || [])
      setLoading(false)
    }

    fetchLeads()
  }, [session, supabase])

  if (loading) return <p>⏳ Bezig met laden...</p>

  if (leads.length === 0) return <p className="mt-4">ℹ️ Je hebt nog geen leads.</p>

  return (
    <table className="mt-6 w-full text-sm border-collapse">
      <thead>
        <tr className="border-b">
          <th className="text-left py-2">Bedrijf</th>
          <th className="text-left py-2">Email</th>
          <th className="text-left py-2">Score</th>
        </tr>
      </thead>
      <tbody>
        {leads.map((lead) => (
          <tr key={lead.id} className="border-b hover:bg-gray-50">
            <td className="py-2">{lead.name}</td>
            <td className="py-2">{lead.email}</td>
            <td className="py-2">{lead.score}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
