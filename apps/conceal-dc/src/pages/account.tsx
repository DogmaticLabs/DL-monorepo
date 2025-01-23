import MainLayout from '@/components/layout/MainLayout'
import { Button } from '@workspace/ui/components/button'
import { useRouter } from 'next/navigation'

import { useEffect, useState } from 'react'

const Account = () => {
  const [userInfo] = useState({
    email: 'user@example.com',
    phone: '+1 (555) 123-4567',
    payments: [
      { id: 1, date: '2024-03-15', amount: 10.0, description: 'Monthly Notification Service' },
      { id: 2, date: '2024-02-15', amount: 10.0, description: 'Monthly Notification Service' },
    ],
  })
  const router = useRouter()
  useEffect(() => {
    router.push('/')
  }, [])

  return null

  return (
    <MainLayout title='Account Settings'>
      <div className='container mx-auto py-8 px-4'>
        <div className='grid gap-8'>
          {/* Contact Information */}
          <section className='bg-card rounded-lg p-6 shadow-sm border'>
            <h2 className='text-xl font-semibold mb-4'>Contact Information</h2>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-muted-foreground mb-1'>
                  Email
                </label>
                <div className='flex items-center justify-between'>
                  <span className='text-foreground'>{userInfo.email}</span>
                  <Button variant='outline' size='sm'>
                    Change Email
                  </Button>
                </div>
              </div>
              <div>
                <label className='block text-sm font-medium text-muted-foreground mb-1'>
                  Phone Number
                </label>
                <div className='flex items-center justify-between'>
                  <span className='text-foreground'>{userInfo.phone}</span>
                  <Button variant='outline' size='sm'>
                    Update Phone
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Payment History */}
          <section className='bg-card rounded-lg p-6 shadow-sm border'>
            <h2 className='text-xl font-semibold mb-4'>Payment History</h2>
            <div className='space-y-4'>
              {userInfo.payments.map(payment => (
                <div
                  key={payment.id}
                  className='flex items-center justify-between py-3 border-b last:border-0'
                >
                  <div>
                    <p className='font-medium'>{payment.description}</p>
                    <p className='text-sm text-muted-foreground'>{payment.date}</p>
                  </div>
                  <span className='font-medium'>${payment.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className='mt-4'>
              <Button variant='outline' size='sm'>
                View All Payments
              </Button>
            </div>
          </section>

          {/* Notification Settings */}
          <section className='bg-card rounded-lg p-6 shadow-sm border'>
            <h2 className='text-xl font-semibold mb-4'>Notification Settings</h2>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium'>Appointment Reminders</p>
                  <p className='text-sm text-muted-foreground'>
                    Receive notifications about upcoming appointments
                  </p>
                </div>
                <Button variant='outline' size='sm'>
                  Configure
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  )
}

export default Account
