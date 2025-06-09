import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { priceId, userId } = body

  console.log('🔍 Checkout aangeroepen met: ', { priceId, userId })

  if (!priceId || !userId) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
      metadata: {
        user_id: userId,
        price_id: priceId, // ✅ Nodig voor de webhook mapping
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('❌ Stripe fout bij create-checkout:', err)
    return NextResponse.json({ error: 'Stripe checkout failed' }, { status: 500 })
  }
}
