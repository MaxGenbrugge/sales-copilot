'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@supabase/auth-helpers-react'

export default function UploadLeadsForm() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const session = useSession()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)
  }

  const handleUpload = async () => {
    if (!file || !session) return

    setLoading(true)
    const body = new FormData()
    body.append('file', file)

    const res = await fetch('/api/leads/upload', {
      method: 'POST',
      body,
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    })

    setLoading(false)

    if (!res.ok) {
      alert('❌ Upload mislukt')
      return
    }

    alert('✅ Leads geüpload!')
    setFile(null)
    router.refresh()
  }

  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-2">📤 Leads uploaden (CSV)</h3>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="mb-2"
      />
      <button
        disabled={!file || loading}
        onClick={handleUpload}
        className="border px-4 py-1 rounded disabled:opacity-50"
      >
        {loading ? '⏳ Uploaden…' : 'Upload'}
      </button>
    </div>
  )
}
