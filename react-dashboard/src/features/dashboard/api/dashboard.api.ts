import type { DashboardStats } from '@/entities/dashboard/model/types'
import { apiClient } from '@/shared/api/client'

export function getDashboardStats() {
  return apiClient<DashboardStats>('/api/dashboard/stats')
}
