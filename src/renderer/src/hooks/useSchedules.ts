import { getSchedules } from '@renderer/apis/schedules'
import { useQuery } from '@tanstack/react-query'

export const useSchedules = () => {
  return useQuery({
    queryKey: ['get-schedules'],
    queryFn: getSchedules
  })
}
