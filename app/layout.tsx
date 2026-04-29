import './globals.css';
export const metadata = { title: 'Referto Chiaro', description: 'Spiegazione semplice dei referti medici' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="it"><body>{children}</body></html>;
}
