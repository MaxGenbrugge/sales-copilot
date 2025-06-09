import { useEffect, useState } from 'react'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'

export default function useUserPlan() {
  const supabase = useSupabaseClient()
  const user = useUser()
  const [plan, setPlan] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlan = async () => {
      if (!user) {
        console.warn('⚠️ Geen user gevonden, sla ophalen plan over.')
        setLoading(false)
        return
      }

      console.log('📩 Ophalen plan voor user.id:', user.id)

      const { data, error } = await supabase
        .from('profiles')
        .select('subscription_plan')
        .eq('id', user.id)
        .limit(1)
        .maybeSingle()

      if (error) {
        console.error('❌ Fout bij ophalen plan:', error.message)
      } else if (!data) {
        console.warn('⚠️ Geen profiel gevonden voor user.id:', user.id)
      } else {
        console.log('✅ Plan opgehaald:', data.subscription_plan)
        setPlan(data.subscription_plan)
      }

      setLoading(false)
    }

    fetchPlan()
  }, [user, supabase])

  return { plan, loading }
}
