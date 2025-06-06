'use client'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'



export default function TestPage() {
  useEffect(() => {
    const fetchLeads = async () => {
      console.log('📡 Verbinding met Supabase actief...')

      const { data, error } = await supabase.from('leads').select()

      if (error) {
        console.error('❌ ERROR bij ophalen leads:', error)
      } else {
        console.log('✅ DATA ontvangen uit Supabase:', data)
      }
    }

    fetchLeads()
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Supabase testpagina</h1>
      <p>Check je browserconsole voor data uit de ‘leads’ tabel.</p>
    </div>
  )
}
