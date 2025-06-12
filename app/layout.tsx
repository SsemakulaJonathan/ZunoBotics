import { Manrope } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'], // Include a range of weights
  variable: '--font-manrope',
});

export const metadata = {
  title: 'ZunoBotics',
  description: 'Empowering African innovation through robotics and automation.',
};

import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={manrope.variable} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
