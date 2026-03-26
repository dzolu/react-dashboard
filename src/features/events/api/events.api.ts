import type { AuditEvent } from '@/entities/event/model/types'
import { apiClient } from '@/shared/api/client'

export function getEvents() {
  return apiClient<AuditEvent[]>('/api/events')
}
