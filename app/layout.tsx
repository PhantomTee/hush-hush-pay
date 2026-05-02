import type { Metadata } from 'next';
import { Playfair_Display, DM_Mono, Inter } from 'next/font/google';
import './globals.css';
import { WalletContextProvider } from '@/components/WalletContextProvider';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

const dm_mono = DM_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-dm-mono',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Hush-Hush Pay',
  description: 'Privacy-first payroll system built on Solana and Arcium',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${dm_mono.variable} ${inter.variable}`}>
      <body className="bg-obsidian text-white font-inter antialiased" suppressHydrationWarning>
        <WalletContextProvider>
          {children}
        </WalletContextProvider>
      </body>
    </html>
  );
}
