import MainLayout from '@/components/layout/MainLayout'
import OnboardingTour from '@/components/OnboardingTour'
import RecentEvents from '@/components/RecentEvents'
import { Appointment, getDailyAppointments, getRecentAppointments } from '@/lib/api/appointments'
import { Alert, AlertDescription } from '@workspace/ui/components/alert'
import { Button } from '@workspace/ui/components/button'
import { Card, CardContent } from '@workspace/ui/components/card'
import { format, parseISO } from 'date-fns'
import {
  AlertTriangle,
  BellIcon,
  CalendarDaysIcon,
  CheckCircle2,
  Clock,
  Dog,
  ShieldCheck,
} from 'lucide-react'
import { GetStaticProps } from 'next'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Home({
  events,
  nextAppointment,
}: {
  events: Appointment[]
  nextAppointment: string
}) {
  const [showTour, setShowTour] = useState(false)

  useEffect(() => {
    // Check if user has seen the tour before
    const hasSeenTour = localStorage.getItem('hasSeenTour')
    if (!hasSeenTour) {
      setShowTour(true)
    }
  }, [])

  return (
    <MainLayout noHeader>
      <OnboardingTour open={showTour} onOpenChange={setShowTour} />
      <div className='min-h-screen bg-red-500'>
        {/* Hero Section */}
        <div className='relative isolate overflow-hidden'>
          <div className='mx-auto max-w-7xl px-6 pb-12 lg:pb-32 pt-12 lg:pt-24 sm:pb-40 sm:pt-32 lg:px-8 min-h-[60vh] flex items-center'>
            <div className='mx-auto max-w-4xl text-center'>
              <div className='flex justify-center mb-6'>
                <ShieldCheck className='h-20 w-20 text-primary' />
              </div>
              <h1 className='text-4xl font-bold tracking-tight sm:text-6xl text-foreground mb-4'>
                Washington D.C. Concealed Carry Appointment Assistant
              </h1>
              <p className='text-xl leading-8 text-muted-foreground mb-12'>
                Streamline your CCL application process. Get instant notifications when earlier
                appointments become available.
              </p>
              <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                <Link href='/schedule'>
                  <Button size='lg' className='w-full sm:w-auto'>
                    <CalendarDaysIcon className='w-5 h-5 mr-2' />
                    View Schedule
                  </Button>
                </Link>
                <Link href='/notifications'>
                  <Button size='lg' variant='outline' className='w-full sm:w-auto'>
                    <BellIcon className='w-5 h-5 mr-2' />
                    Enable Notifications
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Next Available Section */}
        <div className='bg-muted/50'>
          <div className='mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:px-8'>
            <div className='mx-auto max-w-2xl text-center'>
              <h2 className='text-2xl font-semibold mb-2'>Next Available Appointment</h2>
              <p className='text-3xl font-bold text-primary mb-6'>
                {format(parseISO(nextAppointment), 'MMMM d, yyyy')}
              </p>
              <p className='text-muted-foreground'>
                Don&apos;t want to wait? Enable notifications to get alerted when earlier slots open
                up.
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className='mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8'>
          <div className='mx-auto max-w-2xl text-center mb-16'>
            <h2 className='text-3xl font-bold mb-4'>Why Use Our Service?</h2>
            <p className='text-muted-foreground'>
              We help streamline your CCL application process with real-time updates and
              notifications.
            </p>
          </div>

          <div className='mx-auto max-w-5xl'>
            <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3'>
              <Card className='bg-card/50'>
                <CardContent className='pt-6'>
                  <div className='flex flex-col items-center text-center'>
                    <div className='rounded-full bg-primary/10 p-3 mb-4'>
                      <BellIcon className='w-6 h-6 text-primary' />
                    </div>
                    <h3 className='font-semibold mb-2'>Instant Notifications</h3>
                    <p className='text-muted-foreground'>
                      Get alerted immediately when earlier appointment slots become available.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className='bg-card/50'>
                <CardContent className='pt-6'>
                  <div className='flex flex-col items-center text-center'>
                    <div className='rounded-full bg-primary/10 p-3 mb-4'>
                      <Clock className='w-6 h-6 text-primary' />
                    </div>
                    <h3 className='font-semibold mb-2'>Real-time Updates</h3>
                    <p className='text-muted-foreground'>
                      Our system monitors the schedule 24/7 to catch any appointment changes.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className='bg-card/50 sm:col-span-2 lg:col-span-1'>
                <CardContent className='pt-6'>
                  <div className='flex flex-col items-center text-center'>
                    <div className='rounded-full bg-primary/10 p-3 mb-4'>
                      <CheckCircle2 className='w-6 h-6 text-primary' />
                    </div>
                    <h3 className='font-semibold mb-2'>Easy to Use</h3>
                    <p className='text-muted-foreground'>
                      Simple setup process and customizable notification preferences.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className='bg-muted/50'>
          <div className='mx-auto max-w-7xl px-6 pt-16 pb-8 sm:py-24 lg:px-8'>
            <div className='mx-auto max-w-2xl text-center mb-12'>
              <h2 className='text-3xl font-bold mb-4'>Recent Activity</h2>
              <p className='text-muted-foreground'>
                Stay updated with the latest appointment changes and availability.
              </p>
            </div>
            <div className='mx-auto max-w-3xl'>
              <RecentEvents events={events} />
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className='my-12'>
          <Alert className=''>
            <AlertTriangle className='h-4 w-4' />
            <AlertDescription>
              Please note: This service only monitors appointment availability and sends
              notifications. You will still need to book your actual appointment through the{' '}
              <Link
                href='https://go.nemoqappointment.com/Booking/Booking/Index/dc876re9gh'
                target='_blank'
                rel='noopener noreferrer'
                className='hover:underline text-blue-500'
              >
                official DC MPD Portal
              </Link>{' '}
              when a suitable time becomes available.
            </AlertDescription>
          </Alert>
        </div>

        {/* Branding */}
        <div className='flex items-center justify-center gap-2 py-8 text-muted-foreground'>
          <span>Built with ♥️ by</span>
          <div className='flex items-center gap-1.5'>
            <Dog className='h-5 w-5' />
            <span className='font-semibold'>Dogmatic Labs</span>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const recentEvents = await getRecentAppointments()
  const dailyAppointments = await getDailyAppointments()

  return {
    props: {
      events: recentEvents.items,
      nextAppointment: dailyAppointments.open[0],
    },
    revalidate: 60,
  }
}
