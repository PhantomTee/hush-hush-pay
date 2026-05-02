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
  title: 'HushHush Pay',
  description: 'A confidential payroll protocol using decentralized Multi-Party Computation (MPC) to secure salary data while automating on-chain disbursements.',
};

import { Preloader } from '@/components/Preloader';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${dm_mono.variable} ${inter.variable}`}>
      <body className="bg-obsidian text-white font-inter antialiased" suppressHydrationWarning>
        <WalletContextProvider>
          <Preloader />
          {children}
        </WalletContextProvider>
      </body>
    </html>
  );
}
