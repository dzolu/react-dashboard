import { useQuery } from '@tanstack/react-query'

import { getDashboardStats } from '../api/dashboard.api'

export function useDashboardStatsQuery() {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats,
  })
}
