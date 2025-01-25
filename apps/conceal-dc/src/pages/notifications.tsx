import MainLayout from '@/components/layout/MainLayout'
import LoginDialog from '@/components/LoginDialog'
import {
  createNotification,
  deleteNotification,
  fetchNotifications,
  NotificationPreference,
  updateNotification,
} from '@/lib/api/notifications'
import useDailyAppointments from '@/lib/hook/dailyAppointments'
import { CheckBadgeIcon, ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@workspace/ui/components/button'
import { Calendar } from '@workspace/ui/components/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Checkbox } from '@workspace/ui/components/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@workspace/ui/components/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select'
import { Switch } from '@workspace/ui/components/switch'
import { cn } from '@workspace/ui/lib/utils'
import { addMonths, format, parseISO } from 'date-fns'
import { debounce } from 'lodash'
import { BellIcon, CalendarIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { z, ZodIssue } from 'zod'

const daysOfWeek = [
  { id: 'MON', label: 'Monday' },
  { id: 'TUE', label: 'Tuesday' },
  { id: 'WED', label: 'Wednesday' },
  { id: 'THU', label: 'Thursday' },
  { id: 'FRI', label: 'Friday' },
]

const notificationPreferenceSchema = z
  .object({
    days: z.array(z.string()).min(1, 'Select at least one day'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    startTime: z.string().min(1, 'Start time is required'),
    endTime: z.string().min(1, 'End time is required'),
  })
  .refine(
    (data: { startDate: string; endDate: string }) => {
      const start = new Date(data.startDate)
      const end = new Date(data.endDate)
      return start <= end
    },
    { message: 'Start date must be before or equal to end date' },
  )
  .refine(
    (data: { startTime: string; endTime: string }) => {
      const [startHour, startMinute] = data.startTime.split(':').map(Number)
      const [endHour, endMinute] = data.endTime.split(':').map(Number)
      return startHour! < endHour! || (startHour! === endHour! && startMinute! < endMinute!)
    },
    { message: 'Start time must be before end time' },
  )

type ValidationError = {
  path: string[]
  message: string
}

const DEFAULT_PREFERENCE = {
  notificationId: '',
  days: ['MON', 'TUE', 'WED', 'THU', 'FRI'],
  startDate: format(new Date(), 'yyyy-MM-dd'),
  endDate: format(addMonths(new Date(), 5), 'yyyy-MM-dd'),
  startTime: '09:00',
  endTime: '16:00',
  createdAt: '',
  updatedAt: '',
}

const NotificationsPage = () => {
  const [errors, setErrors] = useState<ValidationError[]>([])
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false)
  const [pendingNotificationCreate, setPendingNotificationCreate] = useState(false)
  const { data: dailyAppointments } = useDailyAppointments()
  const nextAppointment = dailyAppointments?.open[0]
  const queryClient = useQueryClient()
  const [userEmail, setUserEmail] = useState<string>('')

  const { data: preferences = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
  })

  console.log('pref', preferences)

  const existingPreference = preferences[0]

  // Create a debounced version of the success toast
  const debouncedToastSuccess = useMemo(
    () =>
      debounce(() => toast.success('Notification preferences updated'), 500, {
        // leading: true,
        // trailing: false,
      }),
    [],
  )

  // Cleanup the debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedToastSuccess.cancel()
    }
  }, [])

  // Listen for auth state changes
  useEffect(() => {
    const handleAuthStateChange = async () => {
      if (pendingNotificationCreate && localStorage.getItem('accessToken')) {
        try {
          await createNotification(DEFAULT_PREFERENCE)
          queryClient.invalidateQueries({ queryKey: ['notifications'] })
          toast.success('Notifications enabled')
          setPendingNotificationCreate(false)
        } catch (error) {
          console.error('Failed to enable notifications:', error)
          toast.error('Failed to enable notifications')
        } finally {
        }
      }
    }

    window.addEventListener('authStateChange', handleAuthStateChange)
    return () => window.removeEventListener('authStateChange', handleAuthStateChange)
  }, [pendingNotificationCreate])

  const handleUpdatePreference = async (
    updates: Partial<Omit<NotificationPreference, 'notificationId' | 'createdAt'>>,
  ) => {
    if (!existingPreference) return
    if (!localStorage.getItem('accessToken')) return setLoginModalOpen(true)

    const updatedPreference = {
      notificationId: existingPreference.notificationId,
      days: existingPreference.days,
      startDate: existingPreference.startDate,
      endDate: existingPreference.endDate,
      startTime: existingPreference.startTime,
      endTime: existingPreference.endTime,
      createdAt: existingPreference.createdAt,
      updatedAt: existingPreference.updatedAt,
      ...updates,
    }

    if (!validatePreference(updatedPreference)) return

    try {
      queryClient.setQueryData(['notifications'], [updatedPreference])
      await updateNotification(existingPreference.notificationId, updatedPreference)
      debouncedToastSuccess()
    } catch (error) {
      console.error('Failed to update notification preference:', error)
      toast.error('Failed to update notification preferences')
    }
  }

  // Set initial end date to nextAppointment when it becomes available
  useEffect(() => {
    if (nextAppointment && !existingPreference) {
      handleUpdatePreference({
        endDate: format(parseISO(nextAppointment), 'yyyy-MM-dd'),
      })
    }
  }, [nextAppointment, existingPreference])

  const handleDayToggle = (day: string) => {
    if (!existingPreference) return

    const updatedDays = existingPreference.days.includes(day)
      ? existingPreference.days.filter(d => d !== day)
      : [...existingPreference.days, day].sort((a, b) => {
          const order = ['MON', 'TUE', 'WED', 'THU', 'FRI']
          return order.indexOf(a) - order.indexOf(b)
        })

    handleUpdatePreference({ days: updatedDays })
  }

  const validatePreference = (
    preference: Omit<NotificationPreference, 'notificationId' | 'createdAt'>,
  ) => {
    try {
      notificationPreferenceSchema.parse(preference)
      setErrors([])
      return true
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        setErrors(
          error.errors.map((err: ZodIssue) => ({
            path: err.path.map(p => String(p)),
            message: err.message,
          })),
        )
      }
      return false
    }
  }

  const handleDeletePreference = async (id: string) => {
    try {
      await deleteNotification(id)
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      toast.success('Notifications disabled')
    } catch (error) {
      console.error('Failed to delete notification preference:', error)
    }
  }

  const getErrorForField = (fieldName: string) => {
    return errors.find(error => error.path.includes(fieldName))?.message
  }

  /* Errors for problems in configuration (start date after end date, start time after end time) */
  const getGeneralValidatorErrors = () => {
    return errors.filter(error => error.path.length === 0)
  }

  const timeSlotOptions = useMemo(() => {
    const options = []
    for (let hour = 9; hour <= 16; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === 16 && minute > 0) continue

        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        const label = format(parseISO(`2000-01-01T${time}`), 'h:mm a')
        options.push({ value: time, label })
      }
    }
    return options
  }, [])

  // Get user email from token
  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]!))
        setUserEmail(payload.sub)
      } catch (e) {
        console.error('Error decoding token:', e)
      }
    }
  }, [])

  return (
    <MainLayout title='Notification Preferences'>
      <div className='container mx-auto py-8 px-4'>
        <div className='max-w-3xl mx-auto space-y-6'>
          {/* Hero Section */}
          <div className='text-center mb-8'>
            <div className='flex justify-center mb-4'>
              <BellIcon className='h-12 w-12 text-primary' />
            </div>
            <h1 className='text-3xl font-bold mb-2'>Appointment Notifications</h1>
            <p className='text-lg text-muted-foreground'>
              Get notified when earlier appointment slots become available.
            </p>
          </div>
          {nextAppointment && (
            <div className='flex items-center justify-center gap-2 border-t pt-4'>
              <CalendarIcon className='w-5 h-5 text-muted-foreground' />
              <span className='text-sm text-muted-foreground'>
                Next Available Appointment:{' '}
                <span className='font-semibold text-foreground'>
                  {format(parseISO(nextAppointment), 'MMMM d, yyyy')}
                </span>
              </span>
            </div>
          )}

          {/* Current Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className='flex justify-between'>Notification Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex items-center gap-1'>
                  <Switch
                    id='notifications'
                    checked={!!existingPreference}
                    onCheckedChange={async checked => {
                      if (checked) {
                        if (!localStorage.getItem('accessToken')) {
                          setPendingNotificationCreate(true)
                          return setLoginModalOpen(true)
                        }

                        try {
                          await createNotification(DEFAULT_PREFERENCE)
                          queryClient.invalidateQueries({ queryKey: ['notifications'] })
                          toast.success('Notifications enabled')
                        } catch (error) {
                          console.error('Failed to enable notifications:', error)
                          toast.error('Failed to enable notifications')
                        } finally {
                        }
                      } else {
                        setPendingNotificationCreate(false)
                        if (existingPreference) {
                          handleDeletePreference(existingPreference.notificationId)
                        }
                      }
                    }}
                    className='mr-2'
                    // disabled={isCreating || isUpdating}
                  />
                  <label htmlFor='notifications' className='text-sm font-medium leading-none'>
                    Notify me if an earlier appointment becomes available
                  </label>
                </div>

                {!!existingPreference && (
                  <div className='space-y-6 pt-4 p-4 bg-muted/50 rounded-lg'>
                    {/* Days selection */}
                    <div>
                      <label className='text-sm font-medium mb-2 block'>Days of the Week</label>
                      <div className='flex flex-wrap gap-2'>
                        {daysOfWeek.map(day => (
                          <div
                            key={day.id}
                            className={cn(
                              'flex items-center gap-2 px-4 py-2 rounded-md border cursor-pointer transition-colors border-input hover:bg-accent hover:text-accent-foreground',
                            )}
                            onClick={() => handleDayToggle(day.id)}
                          >
                            <Checkbox checked={existingPreference.days.includes(day.id)} />
                            {day.label}
                          </div>
                        ))}
                      </div>
                      {getErrorForField('days') && (
                        <p className='mt-1 text-sm text-red-600'>{getErrorForField('days')}</p>
                      )}
                    </div>

                    {/* Date range */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-sm font-medium mb-2'>Start Date</label>
                        <DatePicker
                          value={parseISO(existingPreference.startDate)}
                          onChange={date => {
                            if (date) {
                              handleUpdatePreference({
                                startDate: format(date, 'yyyy-MM-dd'),
                              })
                            }
                          }}
                        />
                        {getErrorForField('startDate') && (
                          <p className='mt-1 text-sm text-red-600'>
                            {getErrorForField('startDate')}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className='block text-sm font-medium mb-2'>End Date</label>
                        <DatePicker
                          value={parseISO(existingPreference.endDate)}
                          onChange={date => {
                            if (date) {
                              handleUpdatePreference({
                                endDate: format(date, 'yyyy-MM-dd'),
                              })
                            }
                          }}
                        />
                        {getErrorForField('endDate') && (
                          <p className='mt-1 text-sm text-red-600'>{getErrorForField('endDate')}</p>
                        )}
                      </div>
                    </div>

                    {/* Time range */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-sm font-medium mb-2'>Start Time</label>
                        <Select
                          value={existingPreference.startTime}
                          onValueChange={value => handleUpdatePreference({ startTime: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='Select start time' />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlotOptions.map(({ value, label }) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {getErrorForField('startTime') && (
                          <p className='mt-1 text-sm text-red-600'>
                            {getErrorForField('startTime')}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className='block text-sm font-medium mb-2'>End Time</label>
                        <Select
                          value={existingPreference.endTime}
                          onValueChange={value => handleUpdatePreference({ endTime: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='Select end time' />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlotOptions.map(({ value, label }) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {getErrorForField('endTime') && (
                          <p className='mt-1 text-sm text-red-600'>{getErrorForField('endTime')}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {getGeneralValidatorErrors().length > 0 && (
                  <div className='space-y-4 pt-4'>
                    <div className='flex flex-row-reverse lg:flex-row space-x-4 border p-4 rounded-lg bg-white shadow-sm items-center'>
                      <ExclamationTriangleIcon className='size-5 text-red-500 shrink-0' />
                      <div className='flex-1 space-y-1'>
                        <p className='text-sm text-red-500'>
                          {getGeneralValidatorErrors()
                            .map(error => error.message)
                            .join(', ')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {!!existingPreference && (
                  <div className='space-y-4 pt-4'>
                    <div className='relative'>
                      <div className='absolute inset-0 flex items-center'>
                        <span className='w-full border-t' />
                      </div>
                      <div className='relative flex justify-center text-xs uppercase'>
                        <span className='bg-white px-2 text-muted-foreground'>Summary</span>
                      </div>
                    </div>
                    <div className='flex flex-row-reverse lg:flex-row space-x-4 border p-4 rounded-lg bg-white shadow-sm items-center'>
                      <CheckBadgeIcon className='size-5 text-primary shrink-0' />
                      <div className='flex-1 space-y-1'>
                        <p className='text-sm text-muted-foreground'>
                          You will be notified at{' '}
                          <span className='font-semibold text-foreground'>{userEmail}</span> about
                          open appointments on{' '}
                          <span className='font-semibold text-foreground'>
                            {existingPreference.days.length === 5
                              ? 'weekdays'
                              : existingPreference.days
                                  .map(day => daysOfWeek.find(d => d.id === day)?.label)
                                  .join(', ')}
                          </span>{' '}
                          between{' '}
                          <span className='font-semibold text-foreground'>
                            {format(
                              parseISO(`2000-01-01T${existingPreference.startTime}`),
                              'h:mm a',
                            )}
                          </span>{' '}
                          and{' '}
                          <span className='font-semibold text-foreground'>
                            {format(parseISO(`2000-01-01T${existingPreference.endTime}`), 'h:mm a')}{' '}
                            ET
                          </span>
                          .
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <LoginDialog loginModalOpen={loginModalOpen} setLoginModalOpen={setLoginModalOpen} />
    </MainLayout>
  )
}

const DatePicker = ({
  value,
  onChange,
}: {
  value?: Date
  onChange: (date: Date | undefined) => void
}) => {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className='bg-transparent'>
        <Button
          variant={'outline'}
          className={cn(
            'justify-start text-left font-normal w-full',
            !value && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          {value ? format(value, 'PPP') : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <Calendar
          mode='single'
          selected={value}
          onSelect={date => {
            onChange(date)
            setOpen(false)
          }}
          defaultMonth={value}
          fromDate={new Date()}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

export default NotificationsPage
