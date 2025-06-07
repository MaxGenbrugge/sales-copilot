'use client'

import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react'

export default function AddLeadButton() {
  const supabase = useSupabaseClient()
  const session = useSession()

  const handleAddLead = async () => {
    if (!session) return alert('❌ Niet ingelogd')

    const { error } = await supabase.from('leads').insert([
      {
        name: 'Tesla',
        email: 'contact@tesla.com',
        score: 91,
        user_id: session.user.id, // 🔥 belangrijk
      },
    ])

    if (error) {
      alert('❌ Fout bij toevoegen: ' + error.message)
    } else {
      alert('✅ Lead toegevoegd')
    }
  }

  return (
    <button onClick={handleAddLead} className="bg-black text-white px-4 py-2 rounded">
      Voeg test-lead toe
    </button>
  )
}
