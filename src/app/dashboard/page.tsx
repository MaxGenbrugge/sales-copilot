'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import AddLeadButton from './AddLeadButton'
import LeadsList from './LeadsList' // ✅ hier importeren

export default function DashboardPage() {
  const session = useSession()
  const supabase = useSupabaseClient()
  const router = useRouter()

  useEffect(() => {
    if (!session) {
      router.push('/login')
    }
  }, [session, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (!session) {
    return <p className="p-6">🔒 Je wordt doorgestuurd naar de loginpagina...</p>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">👋 Welkom in je Dashboard</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 border border-red-600 px-3 py-1 rounded hover:bg-red-50"
        >
          Uitloggen
        </button>
      </div>

      <p className="mb-4">
        Je bent ingelogd als <strong>{session.user.email}</strong>.
      </p>

      {/* 🔘 Knop om test-lead toe te voegen */}
      <AddLeadButton />

      {/* 📋 Tabel met leads tonen */}
      <LeadsList />
    </div>
  )
}
