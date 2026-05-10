export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="mx-auto max-w-6xl px-6 py-12">
        <header className="mb-14 flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-700">Referto Chiaro</div>
          <div className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
            Primo referto gratuito
          </div>
        </header>

        <section className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <div className="mb-4 inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
              Spiegazione semplice dei referti medici
            </div>

            <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
              Capisci il tuo referto senza ansia e senza linguaggio complicato.
            </h1>

            <p className="mb-8 text-lg leading-8 text-slate-600">
              Carica il PDF del tuo referto, inserisci la tua email e ricevi una
              spiegazione chiara, ordinata e comprensibile. Il sistema genera
              anche un primo semaforo orientativo.
            </p>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              Questo servizio non sostituisce il medico e non formula diagnosi.
              Serve solo a spiegare il contenuto del referto in parole semplici.
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
            <h2 className="mb-2 text-2xl font-bold">Carica il tuo referto</h2>
            <p className="mb-6 text-sm text-slate-500">
              Riceverai la spiegazione via email.
            </p>

            <form action="/api/analyze" method="post" encType="multipart/form-data" className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold">La tua email</label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="nome@email.com"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">PDF del referto</label>
                <input
                  name="file"
                  type="file"
                  accept="application/pdf"
                  required
                  className="w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm"
                />
              </div>

              <label className="flex gap-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                <input type="checkbox" required className="mt-1" />
                <span>
                  Accetto privacy e consenso al trattamento del referto sanitario
                  per ricevere una spiegazione semplificata. Il servizio non
                  fornisce diagnosi medica.
                </span>
              </label>

              <button
                type="submit"
                className="w-full rounded-xl bg-blue-700 px-6 py-4 font-bold text-white shadow-lg transition hover:bg-blue-800"
              >
                Analizza il referto gratis
              </button>
            </form>
          </div>
        </section>

        <section className="mt-20">
          <h2 className="mb-8 text-center text-3xl font-bold">Scegli il piano</h2>

          <div className="grid gap-6 md:grid-cols-3">
            <PricingCard
              title="Singolo referto"
              price="1€"
              description="Perfetto se vuoi analizzare un solo referto."
              features={["1 referto", "Risposta via email", "Semaforo orientativo"]}
            />
            <PricingCard
              title="Base"
              price="4,90€/mese"
              description="Per chi fa controlli periodici."
              features={["20 referti/mese", "Risposta via email", "Costo contenuto"]}
              highlighted
            />
            <PricingCard
              title="Illimitato"
              price="10€/mese"
              description="Per chi vuole massima libertà."
              features={["Referti illimitati", "Risposta via email", "Priorità futura"]}
            />
          </div>
        </section>
      </section>
    </main>
  );
}

function PricingCard({
  title,
  price,
  description,
  features,
  highlighted = false,
}: {
  title: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}) {
  return (
    <div
      className={`rounded-3xl p-6 shadow-sm ring-1 ${
        highlighted
          ? "bg-blue-700 text-white ring-blue-700"
          : "bg-white text-slate-900 ring-slate-200"
      }`}
    >
      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      <div className="mb-4 text-4xl font-extrabold">{price}</div>
      <p className={`mb-6 text-sm ${highlighted ? "text-blue-100" : "text-slate-500"}`}>
        {description}
      </p>
      <ul className="space-y-3 text-sm">
        {features.map((f) => (
          <li key={f}>✓ {f}</li>
        ))}
      </ul>
    </div>
  );
}