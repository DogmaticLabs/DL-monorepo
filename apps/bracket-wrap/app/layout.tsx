import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import { Providers } from '@/components/providers'
import '@workspace/ui/globals.css'

// Define metadata for the application
export const metadata: Metadata = {
  title: 'Bracket Wrap',
  description: 'Your bracket analysis and insights',
  viewport: 'width=device-width, initial-scale=1',
  // You can add more metadata properties here
  // icons: { ... },
  // openGraph: { ... },
  // twitter: { ... },
  appleWebApp: {
    statusBarStyle: 'black-translucent',
  },
}

const fontSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
})

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased h-screen overflow-hidden`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
