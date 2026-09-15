import type { AuditEvent, SaveEventInput } from '@/entities/event/model/types'
import { apiClient } from '@/shared/api/client'

export function getEvents() {
  return apiClient<AuditEvent[]>('/api/events')
}

export function createEvent(input: SaveEventInput) {
  return apiClient<AuditEvent>('/api/events', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export function updateEvent(id: string, input: SaveEventInput) {
  return apiClient<AuditEvent>(`/api/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  })
}

export function deleteEvent(id: string) {
  return apiClient<void>(`/api/events/${id}`, {
    method: 'DELETE',
  })
}
