import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang='en'>
      <Head>
        <link rel='icon' type='image/svg+xml' href='/favicon.svg' />
        <link rel='apple-touch-icon' href='/apple-touch-icon.png' />
        <link rel='manifest' href='/site.webmanifest' />
      </Head>
      <body className='antialiased lg:bg-zinc-100'>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
