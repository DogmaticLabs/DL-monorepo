import { Appointment } from '@/lib/api/appointments'
import { format, formatDistanceToNow, getISOWeek, getYear } from 'date-fns'
import { Clock } from 'lucide-react'
import { Link } from './catalyst/link'

const RecentEvents = ({ events }: { events: Appointment[] }) => {
  return (
    <div className='rounded-lg flex flex-col gap-y-4 border-y py-8 justify-center max-w-full overflow-hidden'>
      <h5 className='flex items-center gap-2 font-semibold text-center justify-center'>
        <Clock className='w-5 h-5' />
        Recent Updates
      </h5>

      <div className='animate-scroll-fast lg:animate-scroll grid grid-flow-col auto-cols-max gap-x-4 max-w-full'>
        {events.map((update, index) => (
          <StatusUpdate key={index} update={update} />
        ))}
      </div>
    </div>
  )
}

function StatusUpdate({ update }: { update: Appointment }) {
  const borderColor = {
    open: '#10B981', // Green
    booked: '#EF4444', // Red
    default: '#F59E0B', // Amber
  }

  const selectedBorderColor =
    borderColor[update.status.toLowerCase() as keyof typeof borderColor] || borderColor.default

  // Capitalize a string (handles multiple words)
  const capitalize = (str: string) => {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  // Extract previous and current statuses
  const getStatusTransition = () => {
    const currentStatus = update.history?.at(-1)?.status || update.status
    const prevStatus = update.history?.at(-2)?.status

    if (!prevStatus) {
      return capitalize(currentStatus)
    }
    return `${capitalize(prevStatus)} → ${capitalize(currentStatus)}`
  }

  // Format relative time from last_changed
  const getRelativeTime = () => {
    if (update.lastChanged > 0) {
      return formatDistanceToNow(new Date(update.lastChanged * 1000), { addSuffix: true })
    }
    return 'Unknown time'
  }

  // Format datetime
  const formattedDate = () => {
    const datetime = `${update.date} ${update.time}`
    return format(new Date(datetime), 'MMM d, h:mm a')
  }

  // Compute the week-based URL
  const getWeekUrl = () => {
    try {
      const date = new Date(`${update.date} ${update.time}`)
      const year = getYear(date)
      const week = getISOWeek(date)
      const paddedWeek = week.toString().padStart(2, '0')
      const slotId = date.toISOString()
      return `/schedule/${year}-W${paddedWeek}?slotId=${slotId}`
    } catch (error) {
      console.error('Error computing week URL:', error)
      return '/schedule'
    }
  }

  return (
    <Link href={getWeekUrl()} className='block'>
      <div
        className='border-l-4 pl-3 py-2 w-40 shadow-md shrink-0'
        style={{ borderColor: selectedBorderColor }}
      >
        <div className='flex flex-col justify-between items-start'>
          <div>
            <p className='font-medium'>{formattedDate()}</p>
            <p className='text-sm text-zinc-500'>{getStatusTransition()}</p>
          </div>
          <span className='text-xs text-zinc-500'>{getRelativeTime()}</span>
        </div>
      </div>
    </Link>
  )
}

export default RecentEvents
