import type { Metadata, Viewport } from 'next'
import Script from 'next/script'

import { Providers } from '@/components/providers'
import '@workspace/ui/globals.css'
import './globals.css'
// Define metadata for the application
export const metadata: Metadata = {
  title: 'Bracket Wrap',
  description: 'View your March Madness Bracket Wrap. 🏀',
  // You can add more metadata properties here
  keywords:
    'basketball, bracket, tournament, March Madness, bracket wrap predictions, bracket wrap insights',
  authors: [{ name: 'Bracket Wrap Team' }],
  creator: 'Bracket Wrap',
  publisher: 'Bracket Wrap',
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🏀</text></svg>',
        type: 'image/svg+xml',
      },
    ],
    apple: [
      {
        url: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🏀</text></svg>',
        rel: 'apple-touch-icon',
        sizes: '180x180',
        type: 'image/svg+xml',
      },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://bracket-wrap.com',
    title: 'Bracket Wrap',
    description: 'View your March Madness Bracket Wrap. 🏀',
    siteName: 'Bracket Wrap',
    images: [
      {
        url: '/logo.png', // Using the logo.png file from the public directory
        width: 800,
        height: 800,
        alt: 'Bracket Wrap Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bracket Wrap',
    description: 'View your March Madness Bracket Wrap. 🏀',
    images: ['/logo.png'], // Using the logo.png file from the public directory
    creator: '@bracketwrap', // Update with your Twitter handle
  },
  appleWebApp: {
    statusBarStyle: 'black-translucent',
    capable: true,
    title: 'Bracket Wrap',
  },
  formatDetection: {
    telephone: false,
  },
  themeColor: '#4F46E5', // Update with your primary brand color
  applicationName: 'Bracket Wrap',
  category: 'sports',
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
      <head>
        {/* Google Analytics */}
        <Script
          src='https://www.googletagmanager.com/gtag/js?id=G-2F0YE14R3N'
          strategy='afterInteractive'
        />
        <Script id='google-analytics' strategy='afterInteractive'>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-2F0YE14R3N');
          `}
        </Script>
      </head>
      <body className={`font-sans antialiased bg-[#1e293b]`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
