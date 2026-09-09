import type { Metadata } from 'next';
import Script from 'next/script';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Sales Analytics Dashboard',
  description: 'Track and analyze your sales performance',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`try{var d=localStorage.getItem('theme-dark');if(d==='true')document.documentElement.classList.add('dark');var a=localStorage.getItem('theme-accent');if(a)document.documentElement.setAttribute('data-accent',a);}catch(e){}`}
        </Script>
      </head>
      <body className="min-h-full flex flex-col">
        <TooltipProvider>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
              <Header />
              <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
          </div>
        </TooltipProvider>
      </body>
    </html>
  );
}
