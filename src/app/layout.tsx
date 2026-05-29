import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';

export const metadata: Metadata = {
  title: 'AA AI GROUP | Platform Produk Digital & Kursus AI',
  description:
    'Platform utama AA AI GROUP untuk mempamerkan produk digital, video pendidikan kecerdasan buatan (AI), lesen aplikasi premium (Canva, CapCut, dll), dan pelbagai servis digital profesional.',
  keywords: ['Canva Pro', 'CapCut Pro', 'Gemini Advanced', 'Google AI', 'Kursus Prompt AI', 'Servis Landing Page'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ms" className="h-full antialiased" suppressHydrationWarning>
      <head>
        {/* Anti-flash Script for Dark Mode Theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })()
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-bg-primary text-text-primary">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
