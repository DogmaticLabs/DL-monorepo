import { Button } from '@workspace/ui/components/button'
import dynamic from 'next/dynamic'
import React from 'react'

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
}

class ErrorBoundaryComponent extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className='min-h-[50vh] flex flex-col items-center justify-center p-4 text-center'>
          <h2 className='text-2xl font-semibold mb-4'>Something went wrong</h2>
          <p className='text-muted-foreground mb-6'>
            We&apos;re working on fixing this issue. Please try again later.
          </p>
          <Button
            onClick={() => {
              this.setState({ hasError: false })
              window.location.reload()
            }}
          >
            Try again
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}

const ErrorBoundary = dynamic(() => Promise.resolve(ErrorBoundaryComponent), {
  ssr: false,
})

export default ErrorBoundary
