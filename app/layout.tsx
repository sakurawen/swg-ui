import { JotaiProvider } from '@/app/_components/jotai-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import cx from 'clsx';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Fira_Code } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { NextThemeProvider } from '@/app/_components/theme-provider';

export const metadata: Metadata = {
  title: 'スワッガー・ユーアイ',
  description: 'スワッガー・ユーアイ',
};


const harmonySans = localFont({
  src: [
    {
      path: '../public/fonts/harmonySans/HarmonyOS_Sans_SC_Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/harmonySans/HarmonyOS_Sans_SC_Bold.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/harmonySans/HarmonyOS_Sans_SC_Bold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/harmonySans/HarmonyOS_Sans_SC_Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--harmony-sans',
  display: 'swap',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  display: 'swap',
  variable: '--fire-code',
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={cx(harmonySans.className, 'min-h-screen', firaCode.variable)}>
        <JotaiProvider>
          <NextThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange>
            <TooltipProvider>{children}</TooltipProvider>
          </NextThemeProvider>
          <Toaster />
        </JotaiProvider>
      </body>
    </html>
  );
}
