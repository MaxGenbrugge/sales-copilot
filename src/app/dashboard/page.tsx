'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import useUserPlan from '@/lib/useUserPlan'
import UploadLeadsForm from './UploadLeadsForm'
import LeadsList from './LeadsList'

export default function DashboardPage() {
  const session = useSession()
  const supabase = useSupabaseClient()
  const router = useRouter()
  const { plan, loading } = useUserPlan()
  const [gmailConnected, setGmailConnected] = useState<boolean | null>(null)

  // 🔁 Redirect naar login als niet ingelogd
  useEffect(() => {
    if (!loading && !session) {
      router.push('/login')
    }
  }, [session, loading, router])

  // ✅ Check Gmail-status via Supabase
  useEffect(() => {
    const checkGmail = async () => {
      if (!session) return

      const { data, error } = await supabase
        .from('user_gmail_tokens')
        .select('user_id')
        .eq('user_id', session.user.id)
        .single()

      console.log('[GMAIL STATUS]', { data, error })
      setGmailConnected(!!data && !error)
    }

    checkGmail()
  }, [session, supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleGoToPricing = () => {
    router.push('/pricing')
  }

  const handleGmailConnect = () => {
    window.location.href = '/api/gmail/auth-url'
  }

  if (loading || !session || gmailConnected === null) {
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

      {/* Gebruiker en plan */}
      <p className="mb-2">
        Je bent ingelogd als <strong>{session.user.email}</strong> en hebt het plan: <strong>{plan}</strong>.
      </p>

      {/* Gmail-status */}
      <p className={`mb-4 text-sm font-semibold ${gmailConnected ? 'text-green-600' : 'text-red-600'}`}>
        {gmailConnected ? '✅ Gmail verbonden' : '❌ Gmail niet verbonden'}
      </p>

      {!gmailConnected && (
        <div className="mb-6 p-4 border bg-blue-50 rounded">
          <p className="mb-2 text-sm text-blue-700">
            Je hebt Gmail nog niet gekoppeld. Verbind nu om e-mails te kunnen versturen.
          </p>
          <button
            onClick={handleGmailConnect}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Verbind met Gmail
          </button>
        </div>
      )}

      {/* Pricing-knop */}
      <button
        onClick={handleGoToPricing}
        className="mb-6 border border-black text-black py-2 px-4 rounded hover:bg-gray-100"
      >
        Bekijk abonnementen
      </button>

      {/* Leads uploaden */}
      <UploadLeadsForm />

      {/* Leadslijst */}
      <LeadsList />

      {/* AI e-mailfunctie */}
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
