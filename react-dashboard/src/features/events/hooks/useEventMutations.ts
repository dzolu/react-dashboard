import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { AuditEvent, SaveEventInput } from '@/entities/event/model/types'

import { createEvent, deleteEvent, updateEvent } from '../api/events.api'

export function useCreateEventMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createEvent,
    onSuccess: (created) => {
      queryClient.setQueryData<AuditEvent[]>(['events'], (current) => [
        created,
        ...(current ?? []),
      ])
    },
  })
}

export function useUpdateEventMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: SaveEventInput }) =>
      updateEvent(id, input),
    onSuccess: (updated) => {
      queryClient.setQueryData<AuditEvent[]>(['events'], (current) =>
        current?.map((item) => (item.id === updated.id ? updated : item))
      )
    },
  })
}

export function useDeleteEventMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteEvent,
    onSuccess: (_, id) => {
      queryClient.setQueryData<AuditEvent[]>(['events'], (current) =>
        current?.filter((item) => item.id !== id)
      )
    },
  })
}
