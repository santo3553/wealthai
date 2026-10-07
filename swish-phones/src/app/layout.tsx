import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SWISH | Certified Used & Refurbished Smartphones in 3D',
  description: 'Immersive 3D shopping for certified pre-owned smartphones. Inspect condition, battery health, and exploded internal diagnostics in real-time 3D.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#09090b] text-[#f4f4f5] antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
        {children}
      </body>
    </html>
  );
}
