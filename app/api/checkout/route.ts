import { NextRequest, NextResponse } from 'next/server';
import { createCheckout } from '@/lib/lemonsqueezy';

const variants: Record<string, string | undefined> = {
  single: process.env.LEMONSQUEEZY_VARIANT_SINGLE,
  base: process.env.LEMONSQUEEZY_VARIANT_BASE,
  pro: process.env.LEMONSQUEEZY_VARIANT_PRO,
};

export async function POST(req: NextRequest) {
  try {
    const { email, plan } = await req.json();
    const variantId = variants[plan];
    if (!email || !variantId) return NextResponse.json({ error: 'Email o piano non valido' }, { status: 400 });
    const url = await createCheckout({ email, variantId });
    return NextResponse.json({ url });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Errore checkout' }, { status: 500 });
  }
}
