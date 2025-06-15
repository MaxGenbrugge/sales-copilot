'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import LeadsList from './LeadsList'
import UploadLeadsForm from './UploadLeadsForm'
import useUserPlan from '@/lib/useUserPlan'

export default function DashboardPage() {
  const session = useSession()
  const supabase = useSupabaseClient()
  const router = useRouter()
  const { plan, loading } = useUserPlan()

  // 🔁 Redirect als niet ingelogd
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
      {/* Header */}
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

      {/* Pricing-button */}
      <button
        onClick={handleGoToPricing}
        className="mb-6 border border-black text-black py-2 px-4 rounded hover:bg-gray-100"
      >
        Bekijk abonnementen
      </button>

      {/* Leads uploaden */}
      <UploadLeadsForm />

      {/* Leads weergeven */}
      <LeadsList />

      {/* AI e-mail functionaliteit */}
      {plan === 'Pro' ? (
        <div className="mt-6 p-4 border rounded bg-green-50">
          <h2 className="text-lg font-semibold">✨ AI-mailfunctie (Pro)</h2>
          <p className="text-sm text-gray-600 mb-2">
            Je kunt nu gepersonaliseerde e-mails laten genereren en verzenden via AI.
          </p>
          <button
            onClick={() => router.push('/dashboard/send-mails')}
            className="text-white bg-green-600 px-4 py-2 rounded hover:bg-green-700"
          >
            Verstuur AI-mails
          </button>
        </div>
      ) : (
        <div className="mt-6 p-4 border rounded bg-yellow-50">
          <h2 className="text-lg font-semibold">🔒 Alleen voor Pro-gebruikers</h2>
          <p className="text-sm text-gray-600">
            Upgrade naar Pro om toegang te krijgen tot de AI-mailfunctionaliteit.
          </p>
        </div>
      )}
    </div>
  )
}
