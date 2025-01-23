import { requestOtp, verifyOtp } from '@/lib/api/auth'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@workspace/ui/components/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@workspace/ui/components/input-otp'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Input } from './catalyst/input'

type LoginModalProps = {
  loginModalOpen: boolean
  setLoginModalOpen: (open: boolean) => void
}

const LoginDialog = ({ loginModalOpen, setLoginModalOpen }: LoginModalProps) => {
  const [loginStep, setLoginStep] = useState<'email' | 'otp'>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)
  const prevOtpLength = useRef(0)
  const [error, setError] = useState<string | null>(null)

  const handleLoginSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault()

      // Prevent duplicate submissions
      if (isLoading) return

      try {
        setIsLoading(true)
        if (loginStep === 'email') {
          await requestOtp(email)
          setLoginStep('otp')
        } else {
          await verifyOtp(email, otp)
          setLoginModalOpen(false)
          setLoginStep('email')
          setOtp('')
          // Refresh notifications after successful login
          queryClient.invalidateQueries({ queryKey: ['notifications'] })
          toast.success('Logged in successfully')
        }
      } catch {
        if (loginStep === 'otp') setError('Invalid verification code')
        else setError('Failed to send verification code')
      } finally {
        setIsLoading(false)
      }
    },
    [email, otp, loginStep, queryClient, setLoginModalOpen, isLoading],
  )

  useEffect(() => {
    if (otp.length === 6 && prevOtpLength.current !== 6 && !isLoading && loginStep === 'otp') {
      handleLoginSubmit()
    }
    prevOtpLength.current = otp.length
  }, [otp, loginStep, isLoading, handleLoginSubmit])

  useEffect(() => {
    if (!loginModalOpen) {
      setError(null)
      setOtp('')
      setLoginStep('email')
    }
  }, [loginModalOpen])

  return (
    <Dialog open={loginModalOpen} onOpenChange={setLoginModalOpen}>
      <DialogContent>
        <form onSubmit={handleLoginSubmit}>
          <DialogHeader>
            <DialogTitle>
              {loginStep === 'email' ? 'Enter your email' : 'Enter verification code'}
            </DialogTitle>
            <DialogDescription>
              {loginStep === 'email'
                ? "We'll send you a verification code to your email."
                : 'Check your email for the verification code.'}
            </DialogDescription>
          </DialogHeader>

          <div className='my-6'>
            {loginStep === 'email' ? (
              <Input
                type='email'
                placeholder='name@example.com'
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete='email'
                autoFocus
              />
            ) : (
              <InputOTP maxLength={6} value={otp} onChange={setOtp} autoFocus>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            )}
          </div>

          {error && <p className='text-red-500 text-sm'>{error}</p>}

          <DialogFooter>
            {loginStep === 'otp' && (
              <Button
                type='button'
                variant='outline'
                onClick={() => {
                  setLoginStep('email')
                  setOtp('')
                }}
              >
                Back
              </Button>
            )}
            <Button
              type='submit'
              disabled={loginStep === 'email' ? !email : otp.length !== 6}
              loading={isLoading}
            >
              {loginStep === 'email' ? 'Continue' : 'Verify'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default LoginDialog
