import { useQuery } from '@tanstack/react-query'
import { getDailyAppointments, type DailyAppointmentsResponse } from '../api/appointments'

const useDailyAppointments = () =>
  useQuery<DailyAppointmentsResponse>({
    queryKey: ['dailyAppointments'],
    queryFn: getDailyAppointments,
  })

export default useDailyAppointments
