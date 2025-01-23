import MainLayout from '@/components/layout/MainLayout'
import LoginDialog from '@/components/LoginDialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@workspace/ui/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@workspace/ui/components/form'
import { Input } from '@workspace/ui/components/input'
import { Textarea } from '@workspace/ui/components/textarea'
import { CheckCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ControllerRenderProps, useForm } from 'react-hook-form'
import * as z from 'zod'

const formSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
})

type FormValues = z.infer<typeof formSchema>

const Support = () => {
  // const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false)

  useEffect(() => {
    // Check initial auth state
    const checkAuthState = () => {
      const accessToken = localStorage.getItem('accessToken')
      setIsAuthenticated(!!accessToken)

      if (!accessToken) return

      try {
        const payload = JSON.parse(atob(accessToken.split('.')[1]!))
        setUserEmail(payload.sub)
      } catch (e) {
        console.error('Error decoding token:', e)
      }
    }

    // Check initial state
    checkAuthState()

    // Listen for auth state changes
    window.addEventListener('authStateChange', checkAuthState)
    return () => window.removeEventListener('authStateChange', checkAuthState)
  }, [])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: '',
      description: '',
    },
  })

  const GOOGLE_FORM_ID = '1FAIpQLScN5_eEaB-07CJTLjSF1J7WT4AH5_BVKEAAkki0GAdnsBud-g'
  const GOOGLE_FORM_URL = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/formResponse`

  const onSubmit = async (values: FormValues) => {
    if (!isAuthenticated) {
      setLoginModalOpen(true)
      return
    }

    try {
      // Create form data
      const formData = new FormData()
      formData.append('entry.878152860', values.subject)
      formData.append('entry.146039084', values.description)
      formData.append('entry.280120288', userEmail)

      // Create a hidden form and submit it
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = GOOGLE_FORM_URL
      form.target = 'hidden_iframe'
      form.style.display = 'none'

      // Add form fields
      for (const [key, value] of formData.entries()) {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = key
        input.value = value as string
        form.appendChild(input)
      }

      // Create hidden iframe
      const iframe = document.createElement('iframe')
      iframe.name = 'hidden_iframe'
      iframe.style.display = 'none'
      document.body.appendChild(iframe)
      document.body.appendChild(form)

      // Submit form
      form.submit()

      // Clean up
      setTimeout(() => {
        document.body.removeChild(form)
        document.body.removeChild(iframe)
      }, 1000)

      // Set submitted state
      setIsSubmitted(true)
    } catch (error) {
      console.error('Error submitting feedback:', error)
    }
  }

  // if (!isAuthenticated) {
  //   return null
  // }

  return (
    <MainLayout title='Support'>
      <div className='container mx-auto py-8 px-4'>
        <Card>
          <CardHeader>
            <CardTitle>Submit Feedback</CardTitle>
            <CardDescription>
              Let us know if you&apos;ve encountered any issues or have suggestions for improvement.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSubmitted ? (
              <div className='flex flex-col items-center justify-center py-8 text-center'>
                <CheckCircle className='h-16 w-16 text-green-500 mb-4' />
                <h3 className='text-xl font-semibold mb-2'>Thank you for your feedback!</h3>
                <p className='text-gray-600 mb-6'>Your submission has been received.</p>
                <Button
                  onClick={() => {
                    setIsSubmitted(false)
                    form.reset()
                  }}
                >
                  Submit Another Response
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                  <FormField
                    control={form.control}
                    name='subject'
                    render={({
                      field,
                    }: {
                      field: ControllerRenderProps<FormValues, 'subject'>
                    }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder='Brief description of the issue' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='description'
                    render={({
                      field,
                    }: {
                      field: ControllerRenderProps<FormValues, 'description'>
                    }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder='Please provide detailed information about your issue or feedback'
                            className='min-h-[150px]'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type='submit' className='w-full'>
                    Submit Feedback
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
      <LoginDialog loginModalOpen={loginModalOpen} setLoginModalOpen={setLoginModalOpen} />
    </MainLayout>
  )
}

export default Support
