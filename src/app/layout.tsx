import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Registrasi - Dari Konten Jadi Cuan Bersama Folago Academy',
  description: 'Form pendaftaran eksklusif acara Dari Konten Jadi Cuan bersama Folago Academy',
  icons: {
    icon: '/logo/folago.png',
    apple: '/logo/folago.png',
  },
  openGraph: {
    title: 'Registrasi - Dari Konten Jadi Cuan',
    description: 'Form pendaftaran eksklusif acara Dari Konten Jadi Cuan bersama Folago Academy',
    images: ['/logo/folago.png'],
  }
}

import { ThemeProvider } from '@/components/ThemeProvider'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeToggle />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
