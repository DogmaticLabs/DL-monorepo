import { Geist, Geist_Mono, Roboto } from 'next/font/google'

import { Providers } from '@/components/providers'
import '@workspace/ui/globals.css'

const fontSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
})

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased bg-zinc-950 text-zinc-50`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
