import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import {
  Alert,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { type FormEvent, useState } from 'react'

import type {
  AuditEvent,
  EventSeverity,
  SaveEventInput,
} from '@/entities/event/model/types'
import { useAuth } from '@/features/auth/context/AuthContext'
import {
  useCreateEventMutation,
  useDeleteEventMutation,
  useUpdateEventMutation,
} from '@/features/events/hooks/useEventMutations'
import { useEventsQuery } from '@/features/events/hooks/useEventsQuery'
import { ApiError } from '@/shared/api/client'
import { EmptyState } from '@/shared/components/empty-state/EmptyState'
import { ErrorState } from '@/shared/components/error-state/ErrorState'
import { LoadingState } from '@/shared/components/loading-state/LoadingState'
import { PageHeader } from '@/shared/components/page-header/PageHeader'

const emptyForm: SaveEventInput = {
  type: '',
  message: '',
  severity: 'info',
  actor: '',
}

const severityColor: Record<EventSeverity, 'info' | 'warning' | 'error'> = {
  info: 'info',
  warning: 'warning',
  error: 'error',
}

function getErrorMessage(error: unknown) {
  if (error instanceof ApiError && error.status === 409)
    return 'This event changed since you opened it. Close the form, review the newest version, and try again.'
  return error instanceof Error
    ? error.message
    : 'The operation could not be completed.'
}

export function EventsPage() {
  const { user } = useAuth()
  const eventsQuery = useEventsQuery()
  const createMutation = useCreateEventMutation()
  const updateMutation = useUpdateEventMutation()
  const deleteMutation = useDeleteEventMutation()
  const [editedEvent, setEditedEvent] = useState<AuditEvent | null>(null)
  const [form, setForm] = useState<SaveEventInput>(emptyForm)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [eventToDelete, setEventToDelete] = useState<AuditEvent | null>(null)
  const [notice, setNotice] = useState('')
  const [operationError, setOperationError] = useState('')

  const openCreate = () => {
    setEditedEvent(null)
    setForm({ ...emptyForm, actor: user?.displayName ?? '' })
    setOperationError('')
    setIsFormOpen(true)
  }

  const openEdit = (auditEvent: AuditEvent) => {
    setEditedEvent(auditEvent)
    setForm({
      type: auditEvent.type,
      message: auditEvent.message,
      severity: auditEvent.severity,
      actor: auditEvent.actor,
      version: auditEvent.version,
    })
    setOperationError('')
    setIsFormOpen(true)
  }

  const save = async (event: FormEvent) => {
    event.preventDefault()
    setOperationError('')
    try {
      if (editedEvent) {
        await updateMutation.mutateAsync({ id: editedEvent.id, input: form })
        setNotice('Event updated successfully.')
      } else {
        await createMutation.mutateAsync(form)
        setNotice('Event created successfully.')
      }
      setIsFormOpen(false)
    } catch (error) {
      setOperationError(getErrorMessage(error))
    }
  }

  const remove = async () => {
    if (!eventToDelete) return
    setOperationError('')
    try {
      await deleteMutation.mutateAsync(eventToDelete.id)
      setEventToDelete(null)
      setNotice('Event deleted successfully.')
    } catch (error) {
      setEventToDelete(null)
      setOperationError(getErrorMessage(error))
    }
  }

  const isSaving = createMutation.isPending || updateMutation.isPending

  return (
    <Stack spacing={3}>
      <PageHeader
        title="Events"
        subtitle="Track product activity, system events, and audit history."
        actions={
          <Button variant="contained" onClick={openCreate}>
            Create event
          </Button>
        }
      />

      {operationError && (
        <Alert severity="error" onClose={() => setOperationError('')}>
          {operationError}
        </Alert>
      )}

      {eventsQuery.isPending ? (
        <LoadingState message="Loading events..." />
      ) : eventsQuery.isError ? (
        <ErrorState
          title="Failed to load events"
          description={getErrorMessage(eventsQuery.error)}
        />
      ) : !eventsQuery.data?.length ? (
        <EmptyState
          title="No events found"
          description="Create the first audit event to start the history."
        />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Event</TableCell>
                <TableCell>Severity</TableCell>
                <TableCell>Actor</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {eventsQuery.data.map((auditEvent) => (
                <TableRow key={auditEvent.id} hover>
                  <TableCell>
                    <Typography fontWeight={600}>
                      {auditEvent.message}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {auditEvent.type}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={auditEvent.severity}
                      color={severityColor[auditEvent.severity]}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{auditEvent.actor}</TableCell>
                  <TableCell>
                    {new Date(auditEvent.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit event">
                      <IconButton
                        aria-label={`Edit ${auditEvent.type}`}
                        onClick={() => openEdit(auditEvent)}
                      >
                        <EditOutlinedIcon />
                      </IconButton>
                    </Tooltip>
                    {user?.role === 'Admin' && (
                      <Tooltip title="Delete event">
                        <IconButton
                          color="error"
                          aria-label={`Delete ${auditEvent.type}`}
                          onClick={() => setEventToDelete(auditEvent)}
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog
        open={isFormOpen}
        onClose={() => !isSaving && setIsFormOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <Stack component="form" onSubmit={save}>
          <DialogTitle>
            {editedEvent ? 'Edit event' : 'Create event'}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2.5} pt={1}>
              {operationError && (
                <Alert severity="error">{operationError}</Alert>
              )}
              <TextField
                label="Type"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                inputProps={{ minLength: 2, maxLength: 100 }}
                helperText="For example: content.published"
                required
              />
              <TextField
                label="Message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                inputProps={{ minLength: 5, maxLength: 500 }}
                multiline
                minRows={3}
                required
              />
              <TextField
                select
                label="Severity"
                value={form.severity}
                onChange={(e) =>
                  setForm({
                    ...form,
                    severity: e.target.value as EventSeverity,
                  })
                }
              >
                <MenuItem value="info">Info</MenuItem>
                <MenuItem value="warning">Warning</MenuItem>
                <MenuItem value="error">Error</MenuItem>
              </TextField>
              <TextField
                label="Actor"
                value={form.actor}
                onChange={(e) => setForm({ ...form, actor: e.target.value })}
                inputProps={{ minLength: 2, maxLength: 100 }}
                required
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsFormOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isSaving}>
              {isSaving ? 'Saving…' : 'Save'}
            </Button>
          </DialogActions>
        </Stack>
      </Dialog>

      <Dialog
        open={Boolean(eventToDelete)}
        onClose={() => !deleteMutation.isPending && setEventToDelete(null)}
      >
        <DialogTitle>Delete event?</DialogTitle>
        <DialogContent>
          This action permanently removes “{eventToDelete?.message}”.
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setEventToDelete(null)}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={remove}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={Boolean(notice)}
        autoHideDuration={3500}
        onClose={() => setNotice('')}
        message={notice}
      />
    </Stack>
  )
}
