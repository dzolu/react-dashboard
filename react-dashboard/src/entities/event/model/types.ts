export type EventSeverity = 'info' | 'warning' | 'error'

export interface AuditEvent {
  id: string
  type: string
  message: string
  severity: EventSeverity
  createdAt: string
  updatedAt: string
  actor: string
  createdByUserId: string
  version: number
}

export interface SaveEventInput {
  type: string
  message: string
  severity: EventSeverity
  actor: string
  version?: number
}
