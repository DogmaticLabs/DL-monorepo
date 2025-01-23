import MainLayout from '@/components/layout/MainLayout'
import { getDailyAppointments } from '@/lib/api/appointments'
import { Button } from '@workspace/ui/components/button'
import { cn } from '@workspace/ui/lib/utils'
import { format, parseISO } from 'date-fns'
import Link from 'next/link'

// Define API Response Types
type DailyAppointments = {
  open: string[]
  booked: string[]
  unavailable: string[]
}

type Availability = {
  available: boolean
  startTime?: string
  endTime?: string
}

type DayInfo = {
  date: string
  isCurrentMonth: boolean
  isToday: boolean
  isWeekend: boolean
  weekNumber: number
  availability?: Availability
}

type ScheduleProps = {
  appointments: DailyAppointments
}

const Schedule = ({ appointments }: ScheduleProps) => {
  const processAppointments = () => {
    const today = new Date()
    const generatedMonths = []
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]

    let firstAvailableDay = null

    for (let i = 0; i < 12; i++) {
      const currentDate = new Date(today.getFullYear(), today.getMonth() + i)
      const monthDays = generateMonthDays(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        appointments,
      )

      firstAvailableDay ??= monthDays.find(day => day.availability?.available)?.date

      generatedMonths.push({
        name: monthNames[currentDate.getMonth()],
        days: monthDays,
        firstDay: getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth()),
      })
    }

    return { months: generatedMonths, firstAvailableDay }
  }

  const { months, firstAvailableDay } = processAppointments()

  return (
    <MainLayout
      title='Appointment Schedule'
      controls={
        <Link href='/notifications'>
          <Button className='bg-black text-white hover:bg-gray-900'>Get Notified</Button>
        </Link>
      }
    >
      <div className='flex flex-col h-full w-full overflow-auto'>
        <div className='w-full mx-auto grid max-w-3xl grid-cols-1 gap-x-8 gap-y-16 px-4 py-16 sm:grid-cols-2 sm:px-6 xl:max-w-none xl:grid-cols-3 xl:px-8 2xl:grid-cols-4'>
          {months.map(month => (
            <section key={month.name} className='text-center'>
              <h2 className='text-sm font-semibold text-gray-900'>{month.name}</h2>
              <div className='mt-6 grid grid-cols-7 text-xs/6 text-gray-500'>
                <div>S</div>
                <div>M</div>
                <div>T</div>
                <div>W</div>
                <div>T</div>
                <div>F</div>
                <div>S</div>
              </div>
              <div className='isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow ring-1 ring-gray-200'>
                {month.days.map((day, dayIdx) => {
                  const selectedDate = parseISO(`${day.date}T00:00:00`)
                  const weekId = format(selectedDate, "yyyy-'W'ww")

                  return (
                    <Link
                      key={day.date}
                      href={{
                        pathname: `/schedule/${weekId}`,
                        query: { day: day.date },
                      }}
                      className={cn(
                        'bg-white py-1.5 focus:z-10 relative flex flex-col items-center gap-1 rounded-none',
                        day.isWeekend
                          ? 'text-gray-400 cursor-not-allowed hover:bg-white'
                          : 'text-gray-900 hover:bg-gray-50',
                      )}
                      style={{ gridColumnStart: dayIdx === 0 ? month.firstDay + 1 : undefined }}
                    >
                      <time
                        dateTime={day.date}
                        className={cn(
                          'flex size-6 items-center justify-center rounded-full',
                          day.isToday && !day.isWeekend && 'bg-indigo-600 font-semibold text-white', // Today (Blue Circle)
                          day.isToday && day.isWeekend && 'bg-gray-200 font-semibold text-gray-400',
                          day.availability?.available &&
                            day.date === firstAvailableDay &&
                            'bg-green-500 font-semibold text-white', // First Available (Green Circle)
                        )}
                      >
                        {day.date?.split('-')?.pop()?.replace(/^0/, '')}
                      </time>
                      {!day.isWeekend &&
                        new Date(day.date) >=
                          new Date(new Date().setDate(new Date().getDate() - 1)) && (
                          <div
                            className={cn(
                              'size-1.5 shrink-0 rounded-full',
                              day.availability?.available
                                ? 'bg-green-500/75' // Available: Green
                                : day.availability?.startTime === 'unavailable'
                                  ? 'bg-gray-400/75' // Unavailable: Gray
                                  : 'bg-red-500/75', // Booked: Red
                            )}
                            title={
                              day.availability?.available
                                ? 'Available'
                                : day.availability?.startTime === 'unavailable'
                                  ? 'Unavailable'
                                  : 'Booked'
                            }
                          />
                        )}
                    </Link>
                  )
                })}
              </div>
            </section>
          ))}
        </div>

        <div className='bg-white border-t shadow-lg'>
          <div className='max-w-3xl mx-auto px-4 py-3 flex items-center justify-center gap-6'>
            <div className='flex items-center gap-2'>
              <div className='size-2 rounded-full bg-green-500/75' />
              <span className='text-sm text-gray-600'>Available Appointments</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='size-2 rounded-full bg-red-500/75' />
              <span className='text-sm text-gray-600'>Fully Booked</span>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

function generateMonthDays(year: number, month: number, apiData: DailyAppointments): DayInfo[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const daysInMonth = getDaysInMonth(year, month)
  const days: DayInfo[] = []

  for (let i = 1; i <= daysInMonth; i++) {
    const currentDate = new Date(year, month, i)
    const dayOfWeek = currentDate.getDay()
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`

    const weekNumber = Math.ceil((i + getFirstDayOfMonth(year, month)) / 7)

    let availability: Availability | undefined

    if (apiData.unavailable.includes(date)) {
      availability = { available: false, startTime: 'unavailable', endTime: 'unavailable' }
    } else if (apiData.open.includes(date)) {
      availability = { available: true }
    } else if (apiData.booked.includes(date)) {
      availability = { available: false }
    }

    days.push({
      date,
      isCurrentMonth: true,
      isToday: currentDate.getTime() === today.getTime(),
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      weekNumber,
      availability,
    })
  }

  return days
}

export async function getStaticProps() {
  const dailyAppointments = await getDailyAppointments()

  return {
    props: {
      appointments: dailyAppointments,
    },
    revalidate: 60,
  }
}

export default Schedule
