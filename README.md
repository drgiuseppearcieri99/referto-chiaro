# Referto Chiaro MVP

Mini sito per spiegare in modo semplice i referti medici ai pazienti.

## Funzioni incluse

- Landing page in italiano
- Upload PDF + email
- Primo referto gratuito
- Piano singolo 1€, Base 4,90€/mese, Pro 10€/mese
- Checkout Lemon Squeezy
- Webhook Lemon Squeezy con verifica firma
- Storage PDF su Supabase
- Invio email con Resend
- Semaforo automatico orientativo basato sui range presenti nel testo estratto dal PDF

## Avvio

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Supabase

1. Crea progetto Supabase.
2. Esegui `supabase/schema.sql` nel SQL editor.
3. Crea bucket privato `reports`.
4. Inserisci `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`.

## Lemon Squeezy

Crea 3 prodotti/varianti:

- singolo referto: 1€ una tantum
- base: 4,90€/mese
- pro: 10€/mese

Poi aggiungi in `.env.local`:

```env
LEMONSQUEEZY_API_KEY=
LEMONSQUEEZY_STORE_ID=
LEMONSQUEEZY_VARIANT_SINGLE=
LEMONSQUEEZY_VARIANT_BASE=
LEMONSQUEEZY_VARIANT_PRO=
LEMONSQUEEZY_WEBHOOK_SECRET=
```

Webhook URL:

```text
https://tuodominio.it/api/webhooks/lemonsqueezy
```

Eventi consigliati:

- order_created
- subscription_created
- subscription_updated
- subscription_cancelled
- subscription_expired

## Resend

Aggiungi:

```env
RESEND_API_KEY=
EMAIL_FROM="Referto Chiaro <noreply@tuodominio.it>"
ADMIN_EMAIL=tuamail@example.com
```

## Note mediche e legali

Questo MVP non deve essere presentato come diagnosi. Usare sempre formule come:

> spiegazione semplificata, orientativa, non sostituisce il medico.

Per dati sanitari serve informativa GDPR, consenso esplicito, sicurezza dei file, policy di cancellazione e preferibilmente revisione legale.

## Limiti tecnici dell'MVP

L’estrazione valori da PDF è volutamente semplice. Per produzione servono:

- OCR per PDF scannerizzati
- parser più robusto per diversi laboratori
- validazione medica dei range
- revisione manuale dei casi gialli/rossi
- dashboard admin
- cancellazione automatica file
