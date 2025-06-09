'use client'

import { useEffect } from 'react'
import { useSession } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/navigation'

type Plan = {
  name: string
  price: number
  priceId: string
}

const plans: Plan[] = [
  { name: 'Hobby', price: 1999, priceId: 'price_1RY2o4LpKHUUkA8WKdajTM8e' },
  { name: 'Standard', price: 3999, priceId: 'price_1RY2nmLpKHUUkA8Wltf8cvX8' },
  { name: 'Pro', price: 5999, priceId: 'price_1RY2jJLpKHUUkA8WanT2j0XK' },
]

export default function PricingPage(): React.ReactElement {
  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    console.log('👤 Session:', session)
  }, [session])

  const handleSubscribe = async (priceId: string) => {
    if (!session?.user) {
      router.push('/login')
      return
    }

    const res = await fetch('/api/stripe/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        userId: session.user.id,
      }),
    })

    const data = await res.json()
    if (data.url) router.push(data.url)
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">💳 Kies je plan</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.name} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{plan.name}</h2>
            <p className="text-gray-500 mb-4">
              €{(plan.price / 100).toFixed(2)} / maand
            </p>
            <button
              onClick={() => handleSubscribe(plan.priceId)}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Kies {plan.name}
            </button>
          </div>
        ))}
      </div>
    </main>
  )
}
