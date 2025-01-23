import ErrorBoundary from '@/components/ErrorBoundary'
import '@/styles/globals.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@workspace/ui/components/sonner'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { NuqsAdapter } from 'nuqs/adapters/next/pages'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 60 * 1000,
    },
  },
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NuqsAdapter>
      <QueryClientProvider client={queryClient}>
        <Head>
          <title>Conceal DC</title>
          <meta
            name='description'
            content='Washington D.C. Concealed Carry Appointment Assistant'
          />
        </Head>
        <link rel='stylesheet' href='https://rsms.me/inter/inter.css' />
        <Toaster />
        <ErrorBoundary>
          <Component {...pageProps} />
        </ErrorBoundary>
      </QueryClientProvider>
    </NuqsAdapter>
  )
}
