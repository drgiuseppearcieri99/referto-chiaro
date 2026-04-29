import { NextRequest, NextResponse } from 'next/server';
import * as pdf from 'pdf-parse';
import { supabaseAdmin } from '@/lib/supabase';
import { calculateTrafficLight, extractLabValues, lightLabel } from '@/lib/traffic-light';
import { sendReportEmail } from '@/lib/email';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const email = String(form.get('email') || '').toLowerCase().trim();
    const file = form.get('file') as File | null;
    if (!email || !file) return NextResponse.json({ error: 'Email e PDF obbligatori' }, { status: 400 });
    if (file.type !== 'application/pdf') return NextResponse.json({ error: 'Carica solo PDF' }, { status: 400 });
    if (file.size > 6 * 1024 * 1024) return NextResponse.json({ error: 'PDF massimo 6MB per MVP' }, { status: 400 });

    const { data: user } = await supabaseAdmin.from('users').select('*').eq('email', email).maybeSingle();
    const freeAvailable = !user?.free_report_used;
    const hasCredits = user?.plan === 'pro' || (user?.credits || 0) > 0;

    if (!freeAvailable && !hasCredits) {
      return NextResponse.json({ paymentRequired: true, lightLabel: 'Pagamento richiesto', message: 'Hai già usato il primo referto gratuito. Acquista un referto o scegli un piano.' });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const path = `${email}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
    await supabaseAdmin.storage.from(process.env.SUPABASE_REPORTS_BUCKET || 'reports').upload(path, buffer, { contentType: 'application/pdf', upsert: false });

    const parsed = await pdf(buffer);
    const values = extractLabValues(parsed.text);
    const traffic = calculateTrafficLight(values);
    const readableLight = lightLabel(traffic.light);
    const message = traffic.notes.join('<br/>');

    const { data: report } = await supabaseAdmin.from('reports').insert({
      user_email: email,
      pdf_path: path,
      status: 'analyzed',
      traffic_light: traffic.light,
      extracted_values: values,
      ai_summary: traffic.notes.join('\n'),
    }).select().single();

    if (!user) {
      await supabaseAdmin.from('users').insert({ email, free_report_used: true, credits: 0, plan: 'free' });
    } else if (freeAvailable) {
      await supabaseAdmin.from('users').update({ free_report_used: true }).eq('email', email);
    } else if (user.plan !== 'pro') {
      await supabaseAdmin.from('users').update({ credits: Math.max((user.credits || 0) - 1, 0) }).eq('email', email);
    }

    await sendReportEmail({
      to: email,
      subject: `Il tuo referto: semaforo ${readableLight}`,
      html: `<h1>Risultato orientativo: ${readableLight}</h1><p>${message}</p><hr/><p><strong>Importante:</strong> questa è una spiegazione semplificata e non una diagnosi. Per sintomi, urgenze o dubbi consulta il medico.</p><p>ID referto: ${report?.id || ''}</p>`,
    });

    if (process.env.ADMIN_EMAIL) {
      await sendReportEmail({ to: process.env.ADMIN_EMAIL, subject: `Nuovo referto da verificare: ${email}`, html: `<p>Nuovo referto caricato da ${email}</p><p>Semaforo: ${readableLight}</p><p>ID: ${report?.id || ''}</p>` });
    }

    return NextResponse.json({ light: traffic.light, lightLabel: readableLight, message: traffic.notes.join(' ') });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Errore analisi' }, { status: 500 });
  }
}
