import crypto from 'crypto';

export function verifyLemonSignature(rawBody: string, signature: string | null) {
  if (!signature) return false;
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET!;
  const hmac = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(signature));
}

export async function createCheckout(params: { email: string; variantId: string; reportId?: string }) {
  const res = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
    },
    body: JSON.stringify({
      data: {
        type: 'checkouts',
        attributes: {
          checkout_data: {
            email: params.email,
            custom: { email: params.email, report_id: params.reportId || '' },
          },
          product_options: {
            redirect_url: `${process.env.NEXT_PUBLIC_SITE_URL}/?payment=success`,
          },
        },
        relationships: {
          store: { data: { type: 'stores', id: process.env.LEMONSQUEEZY_STORE_ID } },
          variant: { data: { type: 'variants', id: params.variantId } },
        },
      },
    }),
  });
  if (!res.ok) throw new Error(await res.text());
  const json = await res.json();
  return json.data.attributes.url as string;
}
