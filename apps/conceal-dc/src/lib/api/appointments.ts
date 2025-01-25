import { camelCaseKeys } from '../util/transform'

interface StatusChange {
  status: 'available' | 'booked' | 'pending'
  timestamp: number
}

export interface Appointment {
  history: StatusChange[]
  date: string
  status: 'Booked' | 'Open'
  time: string
  lastChanged: number
}

interface RecentAppointmentsResponse {
  items: Appointment[]
  nextToken: string
}

export const getRecentAppointments = async (): Promise<RecentAppointmentsResponse> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/recent`)
  return camelCaseKeys(await response.json())
}

export interface DailyAppointmentsResponse {
  open: string[]
  booked: string[]
  unavailable: string[]
}

export const getDailyAppointments = async (): Promise<DailyAppointmentsResponse> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments/daily`, {
    cache: 'force-cache',
  })
  return camelCaseKeys(await response.json())
}

export interface AppointmentSlot {
  date: string
  time: string
  date_time: string
  status: string
  history: {
    status: string
    timestamp: number
  }[]
}

export interface WeeklyAppointmentsResponse {
  items: AppointmentSlot[]
  next_token?: string
}

export const getWeeklyAppointments = async (
  startDate: string,
  endDate: string,
): Promise<WeeklyAppointmentsResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/appointments?start_date=${startDate}&end_date=${endDate}`,
    { headers: { Accept: 'application/json' } },
  )

  if (!response.ok) {
    throw new Error('Failed to fetch appointments')
  }

  return camelCaseKeys(await response.json())
}
