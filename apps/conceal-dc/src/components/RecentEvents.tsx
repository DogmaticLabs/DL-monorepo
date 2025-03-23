import { Appointment } from '@/lib/api/appointments'
import { format, formatDistanceToNow, getISOWeek, getYear, subHours } from 'date-fns'
import { Clock } from 'lucide-react'
import { Link } from './catalyst/link'

interface StatusChange {
  date: string
  time: string
  status: string
  lastChanged: number
  previousStatus?: string
}

const RecentEvents = ({ events }: { events: Appointment[] }) => {
  // Get timestamp for 24 hours ago
  const twentyFourHoursAgo = Math.floor(subHours(new Date(), 24).getTime() / 1000)

  // Flatten and transform all status changes from history, filtering out old ones
  const allStatusChanges: StatusChange[] = events.flatMap(appointment => {
    const changes: StatusChange[] = []
    
    // Process each history item
    appointment.history.forEach((historyItem, index) => {
      // Skip changes older than 24 hours
      if (historyItem.timestamp < twentyFourHoursAgo) return

      changes.push({
        date: appointment.date,
        time: appointment.time,
        status: historyItem.status,
        lastChanged: historyItem.timestamp,
        previousStatus: index > 0 ? appointment.history?.[index - 1]?.status : undefined
      })
    })
    
    return changes
  })

  // Sort all status changes by timestamp, most recent first
  const sortedChanges = allStatusChanges.sort((a, b) => b.lastChanged - a.lastChanged)

  return (
    <div className='rounded-lg flex flex-col gap-y-4 border-y py-8 justify-center max-w-full overflow-hidden'>
      <h5 className='flex items-center gap-2 font-semibold text-center justify-center'>
        <Clock className='w-5 h-5' />
        Recent Updates
      </h5>

      <div className='overflow-hidden relative'>
        <div className='animate-scroll inline-flex gap-x-4 whitespace-nowrap'>
          {sortedChanges.map((update, index) => (
            <StatusUpdate key={index} update={update} isFirst={index === 0} />
          ))}
          {sortedChanges.map((update, index) => (
            <StatusUpdate key={`duplicate-${index}`} update={update} isFirst={index === 0} />
          ))}
        </div>
      </div>
    </div>
  )
}

function StatusUpdate({ update, isFirst }: { update: StatusChange; isFirst?: boolean }) {
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

  // Get status transition text
  const getStatusTransition = () => {
    if (!update.previousStatus) {
      return capitalize(update.status)
    }
    return `${capitalize(update.previousStatus)} → ${capitalize(update.status)}`
  }

  // Format relative time from last_changed
  const getRelativeTime = () => {
    return formatDistanceToNow(new Date(update.lastChanged * 1000), { addSuffix: true })
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
        className='border-l-4 pl-3 py-2 w-40 shadow-md shrink-0 relative'
        style={{ borderColor: selectedBorderColor }}
      >
        {isFirst && (
          <div className='absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500 animate-pulse' />
        )}
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
