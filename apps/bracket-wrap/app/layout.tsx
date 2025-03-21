import type { Metadata, Viewport } from 'next'

import { Providers } from '@/components/providers'
import '@workspace/ui/globals.css'
import './globals.css'
// Define metadata for the application
export const metadata: Metadata = {
  title: 'Bracket Wrap',
  description: 'Your bracket analysis and insights',
  // You can add more metadata properties here
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🏀</text></svg>',
        type: 'image/svg+xml',
      },
    ],
  },
  // openGraph: { ... },
  // twitter: { ... },
  appleWebApp: {
    statusBarStyle: 'black-translucent',
    capable: true,
  },
}

// Define viewport configuration separately
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
