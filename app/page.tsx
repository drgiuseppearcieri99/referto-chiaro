'use client';
import { useState } from 'react';

const plans = [
  { key: 'single', title: 'Singolo referto', price: '1€', desc: 'Dopo il primo gratuito' },
  { key: 'base', title: 'Base', price: '4,90€/mese', desc: '20 referti al mese' },
  { key: 'pro', title: 'Illimitato', price: '10€/mese', desc: 'Referti illimitati' },
];

export default function Home() {
  const [email, setEmail] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !email) return alert('Inserisci email e PDF');
    setLoading(true);
    const form = new FormData();
    form.append('email', email);
    form.append('file', file);
    const res = await fetch('/api/analyze', { method: 'POST', body: form });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  }

  async function checkout(plan: string) {
    const res = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, plan }) });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  }

  return <main className="min-h-screen p-6 text-slate-900">
    <section className="mx-auto max-w-5xl py-10">
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <p className="mb-3 text-sm font-semibold text-blue-700">Primo referto gratuito</p>
        <h1 className="text-4xl font-bold tracking-tight">Spiega i referti medici in parole semplici.</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">Carica il PDF, ricevi subito un semaforo orientativo e poi una spiegazione via email. Non sostituisce il medico.</p>

        <form onSubmit={submit} className="mt-8 grid gap-4 rounded-2xl border p-5">
          <input className="rounded-xl border p-3" type="email" placeholder="La tua email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input className="rounded-xl border p-3" type="file" accept="application/pdf" onChange={e => setFile(e.target.files?.[0] || null)} required />
          <label className="text-sm text-slate-600"><input type="checkbox" required /> Accetto privacy e comprendo che il servizio non fornisce diagnosi medica.</label>
          <button disabled={loading} className="rounded-xl bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">{loading ? 'Analisi in corso...' : 'Analizza il referto'}</button>
        </form>

        {result && <div className="mt-6 rounded-2xl border p-5">
          <h2 className="text-xl font-bold">Risultato immediato: {result.lightLabel}</h2>
          <p className="mt-2 text-slate-700">{result.message}</p>
          {result.paymentRequired && <button onClick={() => checkout('single')} className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-white">Paga 1€ e completa</button>}
        </div>}
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {plans.map(p => <div key={p.key} className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="text-xl font-bold">{p.title}</h3><p className="mt-2 text-3xl font-bold">{p.price}</p><p className="mt-2 text-slate-600">{p.desc}</p>
          <button onClick={() => checkout(p.key)} className="mt-5 rounded-xl border px-4 py-2">Scegli</button>
        </div>)}
      </section>
    </section>
  </main>;
}
