import { getTeams } from '@/app/api/bracket-data'
import { useQuery } from '@tanstack/react-query'

export const useTeams = () => {
  return useQuery({
    queryKey: ['teams'],
    queryFn: () => getTeams(),
  })
}
