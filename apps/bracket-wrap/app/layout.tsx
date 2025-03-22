import type { Metadata, Viewport } from 'next'
import Script from 'next/script'

import { Providers } from '@/components/providers'
import '@workspace/ui/globals.css'
import './globals.css'

// Define metadata for the application
export const metadata: Metadata = {
  title: 'Bracket Wrap',
  description: 'View your March Madness Bracket Wrap. 🏀',
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
    url: 'https://bracketwrap.com',
    title: 'Bracket Wrap',
    description: 'View your March Madness Bracket Wrap. 🏀',
    siteName: 'Bracket Wrap',
    images: [
      {
        url: 'https://bracketwrap.com/logo-bg.png',
        width: 800,
        height: 800,
        alt: 'Bracket Wrap Logo',
        type: 'image/png',
      },
    ],
    determiner: 'the',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bracket Wrap',
    description: 'View your March Madness Bracket Wrap. 🏀',
    images: ['https://bracketwrap.com/logo-bg.png'],
    creator: '@bracketwrap',
    site: '@bracketwrap',
  },
  appleWebApp: {
    statusBarStyle: 'black-translucent',
    capable: true,
    title: 'Bracket Wrap',
  },
  formatDetection: {
    telephone: false,
  },
  themeColor: '#4F46E5',
  applicationName: 'Bracket Wrap',
  category: 'sports',
  other: {
    'og:image:secure_url': 'https://bracketwrap.com/logo-bg.png',
    'og:image:width': '800',
    'og:image:height': '800',
    'og:image:alt': 'Bracket Wrap Logo',
    'og:updated_time': new Date().toISOString(),
    'twitter:image:alt': 'Bracket Wrap Logo',
    canonical: 'https://bracketwrap.com',
    // Optionally, you could add 'fb:app_id': 'YOUR_FACEBOOK_APP_ID'
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
      <body className='font-sans antialiased bg-[#1e293b]'>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
