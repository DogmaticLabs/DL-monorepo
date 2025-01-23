import MainLayout from '@/components/layout/MainLayout'
import { getWeeklyAppointments, type AppointmentSlot } from '@/lib/api/appointments'
import { useBreakpoints } from '@/lib/hook/breakpoints'
import useDailyAppointments from '@/lib/hook/dailyAppointments'
import { ClockIcon } from '@heroicons/react/20/solid'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@workspace/ui/components/button'
import { cn } from '@workspace/ui/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import {
  addDays,
  addMinutes,
  addWeeks,
  format,
  formatDistanceToNow,
  parseISO,
  setHours,
  setMilliseconds,
  setMinutes,
  setSeconds,
  startOfWeek,
  subWeeks,
} from 'date-fns'
import _ from 'lodash'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CalendarArrowDownIcon,
  CalendarIcon,
  XIcon,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { createParser, useQueryState } from 'nuqs'
import * as React from 'react'
import { useEffect, useMemo, useRef } from 'react'

// Add this custom parser before the WeekOfYear component
const cleanDateParser = createParser({
  parse: (value: string) => new Date(value),
  serialize: (date: Date) => format(date, "yyyy-MM-dd'T'HH:mm"),
})

// Add new type for slot details
interface SlotDetails {
  id: string
  datetime: string
  isAvailable: boolean
  recentActivity: {
    id: string
    type: 'booked' | 'available'
    person: {
      name: string
      imageUrl: string
    }
    dateTime: string
    date: string
  }[]
}

const WeekOfYear = () => {
  const router = useRouter()
  const { weekId } = router.query
  const queryClient = useQueryClient()
  const { lg } = useBreakpoints()

  // Determine the first day (Monday) of the given Week
  const currentDate = useMemo(() => {
    if (!weekId) return

    const [year, week] = (weekId as string).split('-W')
    const firstDayOfYear = new Date(parseInt(year!), 0, 1)
    return startOfWeek(addWeeks(firstDayOfYear, parseInt(week!) - 1), { weekStartsOn: 1 })
  }, [weekId])

  // Query for the current week's appointments
  const {
    data: appointmentData = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: currentDate ? ['appointments', format(currentDate, 'yyyy-MM-dd')] : [],
    queryFn: () => (currentDate ? fetchWeekAppointments(currentDate) : Promise.resolve([])),
    enabled: !!currentDate,
  })

  // Auto-select Monday 9am on large screens when no slot is selected
  const defaultSelectedSlot = useMemo(() => {
    const shouldAutoSelect = lg && currentDate && appointmentData?.length > 0
    if (!shouldAutoSelect) return null

    // Helper to find first available slot for a given date
    const findFirstSlotForDate = (date: Date) => {
      const dateStr = format(date, 'yyyy-MM-dd')
      return appointmentData.find(
        slot => slot.date === dateStr && slot.time === '09:00' && slot.status !== 'Unavailable',
      )
    }

    // Try Monday first, then Tuesday if Monday unavailable
    const slot = findFirstSlotForDate(currentDate) || findFirstSlotForDate(addDays(currentDate, 1))

    if (slot) return new Date(`${slot.date}T${slot.time}`)
    return null
  }, [lg, currentDate, appointmentData])

  // Keep track of the selectedSlot with Query State
  let [selectedSlot, setSelectedSlot] = useQueryState('slotId', cleanDateParser)
  selectedSlot ??= defaultSelectedSlot

  const [dayParam, setDayParam] = useQueryState('day')

  // Extract query function logic into a reusable function
  const fetchWeekAppointments = async (weekStart: Date) => {
    const startDate = format(weekStart, 'yyyy-MM-dd')
    const endDate = format(addDays(weekStart, 4), 'yyyy-MM-dd')
    const data = await getWeeklyAppointments(startDate, endDate)

    // Create a set of dates returned from the API
    const returnedDates = new Set(data.items.map(slot => slot.date))

    // Generate all expected dates (Mon-Fri)
    const expectedDates = Array.from({ length: 5 }, (_, i) =>
      format(addDays(weekStart, i), 'yyyy-MM-dd'),
    )

    const missingDates = expectedDates.filter(date => !returnedDates.has(date))

    // Define the time range for each day (9:00 AM - 3:50 PM in 10-minute intervals)
    const startTime = setMilliseconds(setSeconds(setMinutes(setHours(weekStart, 9), 0), 0), 0)
    const endTime = setMilliseconds(setSeconds(setMinutes(setHours(weekStart, 15), 50), 0), 0)

    const timeRange: string[] = []
    let currTime = startTime
    while (currTime <= endTime) {
      timeRange.push(format(currTime, 'HH:mm'))
      currTime = addMinutes(currTime, 10)
    }

    // For missing days, add "Unavailable" for each time
    const unavailableSlots: AppointmentSlot[] = missingDates.flatMap(date =>
      timeRange.map(time => ({
        date,
        time,
        date_time: `${date}T${time}`,
        status: 'Unavailable', // distinct from 'Booked'
        history: [],
      })),
    )

    // Merge fetched slots with "unavailable" slots
    return [...data.items, ...unavailableSlots]
  }

  // Prefetch adjacent weeks
  useEffect(() => {
    if (!currentDate) return

    // Prefetch next week
    const nextWeek = addWeeks(currentDate, 1)
    const nextWeekKey = ['appointments', format(nextWeek, 'yyyy-MM-dd')]
    if (!queryClient.getQueryData(nextWeekKey)) {
      queryClient.prefetchQuery({
        queryKey: nextWeekKey,
        queryFn: () => fetchWeekAppointments(nextWeek),
      })
    }

    // Prefetch previous week
    const prevWeek = subWeeks(currentDate, 1)
    const prevWeekKey = ['appointments', format(prevWeek, 'yyyy-MM-dd')]
    if (!queryClient.getQueryData(prevWeekKey)) {
      queryClient.prefetchQuery({
        queryKey: prevWeekKey,
        queryFn: () => fetchWeekAppointments(prevWeek),
      })
    }
  }, [currentDate, queryClient, fetchWeekAppointments])

  // New useEffect to handle the 'day' query parameter
  useEffect(() => {
    if (dayParam && appointmentData?.length > 0) {
      // Find the first available slot for the given day
      const firstAvailableSlot = appointmentData.find(
        slot => slot.date === dayParam && slot.status === 'Open',
      )

      // If there's an available slot, use it; otherwise use the first slot of the day
      const slotToUse = firstAvailableSlot || appointmentData.find(slot => slot.date === dayParam)

      if (slotToUse && lg) {
        const slotDateTime = new Date(`${slotToUse.date}T${slotToUse.time}`)
        setSelectedSlot(slotDateTime)
      }
      // Clear the 'day' query parameter
      setDayParam(null)
    }
  }, [dayParam, appointmentData, setSelectedSlot, setDayParam])

  // Build a lookup map of date+time => AppointmentSlot
  const slotLookup = useMemo(() => {
    const map = new Map<string, AppointmentSlot>()

    if (appointmentData) {
      for (const slot of appointmentData) {
        const key = `${slot.date}T${slot.time}` // "2025-02-16T09:00"
        map.set(key, slot)
      }
    }
    return map
  }, [appointmentData])

  // Prebuild the entire 9:00–3:50 range for Mon-Fri
  const timeRange = useMemo(() => {
    if (!currentDate) return []
    const times = []
    const startTime = setMilliseconds(setSeconds(setMinutes(setHours(currentDate, 9), 0), 0), 0)
    const endTime = setMilliseconds(setSeconds(setMinutes(setHours(currentDate, 15), 50), 0), 0)
    let currTime = startTime
    while (currTime <= endTime) {
      times.push(new Date(currTime))
      currTime = addMinutes(currTime, 10)
    }
    return times
  }, [currentDate])

  if (!currentDate) return null

  return (
    <MainLayout
      title={`Week of ${format(currentDate, 'MMMM d, yyyy')}`}
      controls={<WeekControls />}
    >
      <div className='grid grid-cols-1 lg:grid-cols-3 lg:space-x-8 h-full overflow-auto relative'>
        {/* Main calendar grid */}
        <div className='lg:col-span-2 flex flex-col lg:pr-4 lg:border-r lg:h-full overflow-auto'>
          <WeekHeader currentDate={currentDate} />
          <div className='grid grid-cols-[5rem_repeat(5,1fr)] gap-1 overflow-auto p-2 lg:p-4 h-[calc(100vh-21rem)] lg:h-[calc(100vh-17rem)]'>
            {isLoading ? (
              <div className='col-span-full text-center py-8'>Loading appointments...</div>
            ) : isError ? (
              <div className='col-span-full text-center gap-4 py-8'>
                <div className='text-red-600'>
                  Error loading appointments: {(error as Error)?.message || 'Please try again'}
                </div>
                <Button onClick={() => refetch()} variant='outline'>
                  Retry Loading
                </Button>
              </div>
            ) : (
              timeRange.map((time, index) => (
                <TimeRow
                  key={index}
                  time={time}
                  slotLookup={slotLookup}
                  selectedSlot={selectedSlot}
                  setSelectedSlot={setSelectedSlot}
                />
              ))
            )}
          </div>
        </div>

        {/* Detail view */}
        {selectedSlot && (
          <div
            className={cn(
              'lg:col-start-3 lg:row-end-1',
              'absolute inset-0 lg:static bg-white/95 backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-none',
              'transition-all duration-300 ease-in-out',
              selectedSlot
                ? 'translate-y-0 opacity-100 pointer-events-auto'
                : 'translate-y-full opacity-0 lg:opacity-100',
            )}
          >
            <div className='relative lg:h-full overflow-auto'>
              <div className='p-4 lg:p-0'>
                <SlotDetails
                  slotDate={selectedSlot}
                  appointmentData={appointmentData.find(slot => {
                    const slotDate = new Date(`${slot.date}T${slot.time}`)
                    return (
                      format(slotDate, "yyyy-MM-dd'T'HH:mm") ===
                      format(selectedSlot, "yyyy-MM-dd'T'HH:mm")
                    )
                  })}
                  onClose={() => setSelectedSlot(null)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}

type WeekHeaderProps = {
  currentDate: Date
}

const WeekHeader = ({ currentDate }: WeekHeaderProps) => {
  const start = startOfWeek(currentDate, { weekStartsOn: 1 })
  const days = Array.from({ length: 5 }, (_, i) => addDays(start, i))

  return (
    <div className='flex flex-col bg-white px-4'>
      <div className='grid grid-cols-[repeat(5,1fr)] items-center pl-[5rem]'>
        {days.map(day => (
          <div key={day.toISOString()} className='p-2 text-center'>
            <div className='font-semibold text-gray-700'>{format(day, 'EEE')}</div>
            <div className='text-sm text-gray-500'>{format(day, 'MMM d')}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

const WeekControls = () => {
  const router = useRouter()
  const { weekId } = router.query
  const { data: dailyAppointments } = useDailyAppointments()
  const nextAppointment = dailyAppointments?.open[0]

  const navigateToWeek = (direction: 'next' | 'prev') => {
    if (!weekId) throw new Error('No weekId available for navigation')

    const [year, weekPart] = (weekId as string).split('-W')
    let nextYear = parseInt(year!)
    let nextWeek = parseInt(weekPart!)

    if (direction === 'next') {
      if (nextWeek === 52) {
        nextWeek = 1
        nextYear++
      } else {
        nextWeek++
      }
    } else {
      if (nextWeek === 1) {
        nextWeek = 52
        nextYear--
      } else {
        nextWeek--
      }
    }

    const nextWeekId = `${nextYear}-W${nextWeek.toString().padStart(2, '0')}`
    router.push(`/schedule/${nextWeekId}`)
  }

  const goToNextWeek = () => navigateToWeek('next')
  const goToPreviousWeek = () => navigateToWeek('prev')

  const nextApptWeekId = useMemo(() => {
    if (!nextAppointment) return null

    const selectedDate = parseISO(`${nextAppointment}T00:00:00`)
    console.log(selectedDate)
    const nextApptWeekId = selectedDate ? format(selectedDate, "yyyy-'W'ww") : null
    return nextApptWeekId
  }, [nextAppointment])

  return (
    <div className='flex items-center gap-2'>
      {nextApptWeekId && (
        <Link href={{ pathname: `/schedule/${nextApptWeekId}`, query: { day: nextAppointment } }}>
          <Button variant='outline'>
            <CalendarArrowDownIcon className='w-4 h-4' />
            Next Available
          </Button>
        </Link>
      )}
      <Button variant='outline' onClick={goToPreviousWeek}>
        <ArrowLeftIcon className='w-4 h-4' />
        Previous Week
      </Button>
      <Button variant='outline' onClick={goToNextWeek}>
        Next Week
        <ArrowRightIcon className='w-4 h-4' />
      </Button>
    </div>
  )
}

interface TimeRowProps {
  time: Date
  slotLookup: Map<string, AppointmentSlot>
  selectedSlot: Date | null
  setSelectedSlot: (datetime: Date) => void
}

/**
 * Renders a row: the time label on the left + 5 columns (Mon-Fri).
 * We use slotLookup to quickly determine a slot's status for each column.
 */
const TimeRow = ({ time, slotLookup, selectedSlot, setSelectedSlot }: TimeRowProps) => {
  const rowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (selectedSlot && format(time, 'HH:mm') === format(selectedSlot, 'HH:mm')) {
      rowRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [time, selectedSlot])

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
  const tomorrow = addDays(today, 1)

  return (
    <>
      <div ref={rowRef} className='p-2 text-right text-sm text-gray-500'>
        {format(time, 'h:mm a')}
      </div>

      {new Array(5).fill(0).map((_, i) => {
        const dayDateTime = new Date(time)
        dayDateTime.setDate(dayDateTime.getDate() + i)

        const dateKey = format(dayDateTime, 'yyyy-MM-dd')
        const timeKey = format(dayDateTime, 'HH:mm')
        const slotKey = `${dateKey}T${timeKey}`
        const slotData = slotLookup.get(slotKey)

        const isUnavailable = slotData?.status === 'Unavailable'
        const isSelected =
          !!selectedSlot && dayDateTime.toISOString() === selectedSlot.toISOString()
        const isTodayOrBefore = dayDateTime < tomorrow

        const handleClick = () => {
          if (!isUnavailable) setSelectedSlot(dayDateTime)
        }

        return (
          <AppointmentButton
            key={i}
            onClick={handleClick}
            datetime={dayDateTime}
            status={slotData?.status as any}
            selected={isSelected}
            disabled={isTodayOrBefore}
          />
        )
      })}
    </>
  )
}

const appointmentButtonVariants = cva(
  'p-1 text-sm border rounded transition-colors relative flex items-center justify-center disabled:opacity-60',
  {
    variants: {
      status: {
        Open: 'bg-green-50 hover:bg-green-100 border-green-200 text-green-600 cursor-pointer',
        'available-selected': 'bg-green-400 border-green-300 font-medium shadow-sm text-white',
        Booked: 'bg-red-200 hover:bg-red-100 border-red-200 text-red-600 cursor-pointer',
        'booked-selected': 'bg-red-400 border-red-300 font-medium shadow-sm text-white',
        Unavailable: 'bg-gray-100 border-gray-200 text-gray-600 cursor-not-allowed',
      },
      selected: {
        true: 'font-medium shadow-sm outline outline-2 outline-offset-2 outline-blue-500',
        false: '',
      },
    },
    defaultVariants: {
      status: 'Unavailable',
      selected: false,
    },
  },
)

interface AppointmentButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'>,
    VariantProps<typeof appointmentButtonVariants> {
  selected?: boolean
  datetime?: Date
  disabled?: boolean
}

const AppointmentButton = React.forwardRef<HTMLButtonElement, AppointmentButtonProps>(
  ({ className, status, selected, disabled, ...props }, ref) => {
    if (!status) return null

    return (
      <button
        ref={ref}
        className={cn(appointmentButtonVariants({ status, selected, className }))}
        disabled={status === 'Unavailable' || !!disabled}
        {...props}
      >
        <span className='text-xs lg:text-sm'>{_.startCase(status)}</span>
      </button>
    )
  },
)
AppointmentButton.displayName = 'AppointmentButton'

const SlotDetails = ({
  slotDate,
  appointmentData,
  onClose,
}: {
  slotDate: Date
  appointmentData?: AppointmentSlot
  onClose: () => void
}) => {
  const slot: SlotDetails = {
    id: slotDate.toISOString(),
    datetime: slotDate.toISOString(),
    isAvailable: appointmentData ? appointmentData.status === 'Open' : false,
    recentActivity:
      appointmentData?.history.map((h, index) => ({
        id: index.toString(),
        type: h.status.toLowerCase() === 'booked' ? 'booked' : 'available',
        person: {
          name: 'Anonymous', // The API doesn't provide person details
          imageUrl: '/path/to/image.jpg',
        },
        dateTime: new Date(h.timestamp * 1000).toISOString(),
        date: format(new Date(h.timestamp * 1000), 'MMM d, yyyy @ h:mm a'),
      })) || [],
  }
  return (
    <div>
      <h2 className='sr-only'>Time Slot Details</h2>
      <div className='rounded-lg bg-gray-50 shadow-sm ring-1 ring-gray-900/5'>
        <dl className='flex flex-wrap'>
          <div className='flex-auto pl-6 pt-6'>
            <span className='text-sm/6 font-semibold text-gray-900'>Appointment Details</span>
          </div>
          <div className='flex items-center flex-none self-end px-6 pt-4 gap-x-2'>
            <dt className='sr-only'>Status</dt>
            <dd
              className={`rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                slot.isAvailable
                  ? 'bg-green-50 text-green-600 ring-green-600/20'
                  : 'bg-red-50 text-red-600 ring-red-600/20'
              }`}
            >
              {slot.isAvailable ? 'Available' : 'Booked'}
            </dd>
            <Button variant='ghost' onClick={onClose} className='lg:hidden'>
              <XIcon className='w-6 h-6' />
            </Button>
          </div>

          <div className='mt-6 flex w-full flex-none gap-x-4 border-t border-gray-900/5 px-6 pt-6'>
            <dt className='flex-none'>
              <span className='sr-only'>Date</span>
              <CalendarIcon className='h-6 w-5 text-gray-400' />
            </dt>
            <dd className='text-sm/6 text-gray-900'>
              {format(parseISO(slot.datetime), 'MMMM d, yyyy')}
            </dd>
          </div>

          <div className='mt-4 flex w-full flex-none gap-x-4 px-6'>
            <dt className='flex-none'>
              <span className='sr-only'>Time</span>
              <ClockIcon className='h-6 w-5 text-gray-400' />
            </dt>
            <dd className='text-sm/6 text-gray-900'>{format(parseISO(slot.datetime), 'h:mm a')}</dd>
          </div>
        </dl>
        <div className='mt-6 border-t border-gray-900/5 px-6 pt-6'>
          <h2 className='text-sm/6 font-semibold text-gray-900'>Activity</h2>
          <ul role='list' className='mt-6 space-y-6'>
            {slot.recentActivity.map((activity, idx) => (
              <li key={activity.id} className='relative flex gap-x-4'>
                <div
                  className={`absolute left-0 top-0 flex w-6 justify-center ${
                    idx === slot.recentActivity.length - 1 ? 'h-6' : '-bottom-6'
                  }`}
                >
                  <div className='w-px bg-gray-200' />
                </div>

                <div className='relative flex h-6 w-6 flex-none items-center justify-center'>
                  {activity.type === 'booked' ? (
                    <div className='h-1.5 w-1.5 rounded-full bg-red-100 ring-1 ring-red-600' />
                  ) : (
                    <div className='h-1.5 w-1.5 rounded-full bg-green-100 ring-1 ring-green-600' />
                  )}
                </div>

                <p className='flex-auto py-0.5 text-sm leading-5 text-gray-700'>
                  {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                </p>

                <span className='flex-none py-0.5 text-xs/10 leading-5 text-gray-800 underline decoration-dotted decoration-gray-400'>
                  {formatDistanceToNow(parseISO(activity.dateTime), { addSuffix: true })}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className='mt-6 border-t border-gray-900/5 px-6 py-6'>
          {slot.isAvailable ? (
            <Link
              href='https://go.nemoqappointment.com/Booking/Booking/Index/dc876re9gh'
              target='_blank'
              rel='noopener noreferrer'
              className='w-full'
            >
              <Button className='w-full' variant='default'>
                Book Appointment
                <span className='sr-only'>(opens in new window)</span>
              </Button>
            </Link>
          ) : (
            <div className='flex flex-col gap-4'>
              <Link href='/notifications' passHref>
                <Button className='w-full'>Get Notified</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WeekOfYear
