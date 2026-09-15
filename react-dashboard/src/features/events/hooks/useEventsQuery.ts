import { useQuery } from '@tanstack/react-query'

import { getEvents } from '../api/events.api'

export function useEventsQuery() {
  return useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
  })
}
