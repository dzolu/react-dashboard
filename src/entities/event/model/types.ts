export type EventSeverity = 'info' | 'warning' | 'error'

export interface AuditEvent {
  id: string
  type: string
  message: string
  severity: EventSeverity
  createdAt: string
  actor: string
}
