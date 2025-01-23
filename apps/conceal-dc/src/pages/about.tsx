import MainLayout from '@/components/layout/MainLayout'
import { ShieldCheckIcon } from '@heroicons/react/16/solid'
import { Card, CardContent } from '@workspace/ui/components/card'

const About = () => {
  return (
    <MainLayout title='About Us'>
      <div className='container mx-auto py-8 px-4'>
        <div className='max-w-3xl mx-auto space-y-8'>
          {/* Hero Section */}
          <div className='text-center mb-12'>
            <div className='flex justify-center mb-6'>
              <ShieldCheckIcon className='h-16 w-16 text-primary' />
            </div>
            <h1 className='text-4xl font-bold mb-4'>Fast-Track Your CCL Appointment</h1>
            <p className='text-lg text-muted-foreground'>
              Helping DC secure earlier concealed carry license appointments when they become
              available.
            </p>
          </div>

          {/* Mission Section */}
          <Card>
            <CardContent className='pt-6'>
              <h2 className='text-2xl font-semibold mb-4'>Our Mission</h2>
              <p className='text-muted-foreground leading-relaxed'>
                At Conceal DC, we understand the frustration of long waiting periods for concealed
                carry license appointments. Our mission is to help reduce these wait times by
                alerting you when earlier appointment slots become available due to cancellations,
                allowing you to potentially advance your application timeline by weeks or months.
              </p>
            </CardContent>
          </Card>

          {/* What We Do Section */}
          <Card>
            <CardContent className='pt-6'>
              <h2 className='text-2xl font-semibold mb-4'>What We Do</h2>
              <p className='text-muted-foreground leading-relaxed mb-4'>
                Our service actively monitors the DC Metropolitan Police Department&apos;s
                appointment system for concealed carry license applications. When someone cancels or
                reschedules their appointment, we immediately notify our users who are looking to
                secure an earlier date.
              </p>
              <p className='text-muted-foreground leading-relaxed'>
                By catching these cancellations in real-time, we help ensure that available
                appointments don&apos;t go unnoticed, potentially reducing your wait time
                significantly.
              </p>
            </CardContent>
          </Card>

          {/* Why Choose Us Section */}
          <Card>
            <CardContent className='pt-6'>
              <h2 className='text-2xl font-semibold mb-4'>Why Choose Us</h2>
              <div className='space-y-4'>
                <div>
                  <h3 className='font-medium mb-2'>Instant Notifications</h3>
                  <p className='text-muted-foreground'>
                    Get immediate alerts when earlier appointments become available, giving you the
                    opportunity to secure a closer date.
                  </p>
                </div>
                <div>
                  <h3 className='font-medium mb-2'>Simple to Use</h3>
                  <p className='text-muted-foreground'>
                    Our straightforward platform makes it easy to set up notifications and monitor
                    appointment availability.
                  </p>
                </div>
                <div>
                  <h3 className='font-medium mb-2'>Time-Saving</h3>
                  <p className='text-muted-foreground'>
                    Instead of manually checking for cancellations, let our service do the work and
                    notify you when earlier slots open up.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Commitment Section */}
          <Card>
            <CardContent className='pt-6'>
              <h2 className='text-2xl font-semibold mb-4'>Our Commitment</h2>
              <p className='text-muted-foreground leading-relaxed'>
                We&apos;re committed to providing a reliable service that helps reduce appointment
                waiting times while fully respecting the MPD&apos;s scheduling system and
                procedures. Our goal is simple: help you secure the earliest possible appointment
                date for your CCL application.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}

export default About
