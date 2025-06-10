'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import AddLeadButton from './AddLeadButton'
import LeadsList from './LeadsList'
import useUserPlan from '@/lib/useUserPlan'

export default function DashboardPage() {
  const session = useSession()
  const supabase = useSupabaseClient()
  const router = useRouter()
  const { plan, loading } = useUserPlan()

  // Redirect naar login als niet ingelogd, maar wacht tot loading voorbij is
  useEffect(() => {
    if (!loading && !session) {
      router.push('/login')
    }
  }, [session, router, loading])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleGoToPricing = () => {
    router.push('/pricing')
  }

  if (loading || !session) {
    return <p className="p-6">🔄 Aan het laden...</p>
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
        Je bent ingelogd als <strong>{session.user.email}</strong> en hebt het plan: <strong>{plan}</strong>.
      </p>

      {/* 🔘 Knop om naar pricing te gaan */}
      <button
        onClick={handleGoToPricing}
        className="mb-6 border border-black text-black py-2 px-4 rounded hover:bg-gray-100"
      >
        Bekijk abonnementen
      </button>

      <AddLeadButton />
      <LeadsList />

      {plan === 'Pro' ? (
        <div className="mt-6 p-4 border rounded bg-green-50">
          <h2 className="text-lg font-semibold">✨ Pro Feature</h2>
          <p className="text-sm text-gray-600">Jij hebt toegang tot deze exclusieve AI-tool.</p>
          {/* ⬇️ Voeg hier je AI-tool in */}
        </div>
      ) : (
        <div className="mt-6 p-4 border rounded bg-yellow-50">
          <h2 className="text-lg font-semibold">🔒 Alleen voor Pro-gebruikers</h2>
          <p className="text-sm text-gray-600">
            Upgrade naar Pro om toegang te krijgen tot deze AI-feature.
          </p>
        </div>
      )}
    </div>
  )
}

