import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AA AI GROUP | Platform Digital & AI Hub',
  description: 'Peneraju platform AI, aplikasi premium, video pendidikan kecerdasan buatan, dan servis digital profesional di Malaysia.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ms" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
