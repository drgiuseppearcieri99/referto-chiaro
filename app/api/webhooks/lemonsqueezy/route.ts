import { NextRequest, NextResponse } from 'next/server';
import { verifyLemonSignature } from '@/lib/lemonsqueezy';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const raw = await req.text();
  const sig = req.headers.get('x-signature');
  if (!verifyLemonSignature(raw, sig)) return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });

  const event = JSON.parse(raw);
  const eventName = event?.meta?.event_name;
  const attrs = event?.data?.attributes || {};
  const custom = event?.meta?.custom_data || attrs?.first_order_item?.custom || {};
  const email = (custom.email || attrs.user_email || attrs.customer_email || '').toLowerCase();
  const variantId = String(attrs.variant_id || attrs.first_order_item?.variant_id || '');

  if (!email) return NextResponse.json({ ok: true, ignored: 'no email' });

  if (eventName === 'order_created') {
    if (variantId === process.env.LEMONSQUEEZY_VARIANT_SINGLE) {
      await supabaseAdmin.from('users').upsert({ email, credits: 1 }, { onConflict: 'email' });
    }
  }

  if (eventName === 'subscription_created' || eventName === 'subscription_updated') {
    if (variantId === process.env.LEMONSQUEEZY_VARIANT_BASE) {
      await supabaseAdmin.from('users').upsert({ email, plan: 'base', credits: 20, lemon_subscription_id: event.data.id }, { onConflict: 'email' });
    }
    if (variantId === process.env.LEMONSQUEEZY_VARIANT_PRO) {
      await supabaseAdmin.from('users').upsert({ email, plan: 'pro', credits: 999999, lemon_subscription_id: event.data.id }, { onConflict: 'email' });
    }
  }

  if (eventName === 'subscription_cancelled' || eventName === 'subscription_expired') {
    await supabaseAdmin.from('users').update({ plan: 'free', credits: 0 }).eq('email', email);
  }

  return NextResponse.json({ ok: true });
}
