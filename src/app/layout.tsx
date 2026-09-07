import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MetricsFlow ROI | Interactive B2B SaaS Cost-Savings Calculator',
  description:
    'Calculate your net annual savings, ROI multiple, hours reclaimed, and payback period with the MetricsFlow workforce automation platform.',
  keywords: [
    'B2B SaaS ROI Calculator',
    'Workflow Automation ROI',
    'Labor Cost Savings',
    'Payback Period Calculator',
    'Enterprise Software ROI',
  ],
  authors: [{ name: 'MetricsFlow Inc.' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
        {children}
      </body>
    </html>
  );
}
