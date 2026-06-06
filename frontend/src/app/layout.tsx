import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import Providers from '@/components/providers/Providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'ArenaDesk OS - The Operating System for Gaming Cafés & Esports Venues',
  description: 'Digitize your gaming café with ArenaDesk OS. Real-time session management, billing, reservations, loyalty programs, tournaments, and AI-powered analytics.',
  keywords: ['gaming café', 'esports venue', 'LAN center', 'PC management', 'gaming venue management', 'tournament management', 'game center software'],
  openGraph: {
    title: 'ArenaDesk OS',
    description: 'The Operating System for Gaming Cafés & Esports Venues',
    type: 'website',
    siteName: 'ArenaDesk OS',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-surface-950 text-surface-100 antialiased font-sans">
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1e293b',
                border: '1px solid rgba(51, 65, 85, 0.5)',
                color: '#f1f5f9',
                borderRadius: '12px',
                padding: '16px',
              },
              className: 'text-sm font-medium shadow-xl shadow-black/20',
            }}
            icons={{
              success: (
                <div className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <svg className="h-3 w-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
              ),
              error: (
                <div className="h-5 w-5 rounded-full bg-red-500/20 flex items-center justify-center">
                  <svg className="h-3 w-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </div>
              ),
              warning: (
                <div className="h-5 w-5 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <svg className="h-3 w-3 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" /></svg>
                </div>
              ),
              info: (
                <div className="h-5 w-5 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <svg className="h-3 w-3 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
              ),
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
