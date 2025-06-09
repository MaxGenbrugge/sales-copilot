import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Service role key vereist!
)

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await req.headers).get('stripe-signature') as string
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
    console.log('✅ Webhook ontvangen:', event.type)
  } catch (err) {
    console.error('❌ Webhook fout:', err)
    return new NextResponse('Webhook Error', { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.metadata?.user_id
    const priceId = session.metadata?.price_id || session.subscription

    // Mapping van priceId → plan
    const plan = (() => {
      switch (session.metadata?.price_id) {
        case 'price_1RY2o4LpKHUUkA8WKdajTM8e': return 'Hobby'
        case 'price_1RY2nmLpKHUUkA8Wltf8cvX8': return 'Standard'
        case 'price_1RY2jJLpKHUUkA8WanT2j0XK': return 'Pro'
        default: return 'Free'
      }
    })()

    if (userId && plan) {
      await supabase
        .from('profiles')
        .update({ subscription_plan: plan })
        .eq('id', userId)

      console.log(`✅ Abonnement geüpdatet voor ${userId} → ${plan}`)
    }
  }

  return NextResponse.json({ received: true }, { status: 200 })
}
