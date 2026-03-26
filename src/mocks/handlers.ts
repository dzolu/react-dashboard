import { http, HttpResponse } from 'msw'

import { dashboardStatsMock } from '@/entities/dashboard/mock/dashboard.mock'
import { eventsMock } from '@/entities/event/mock/events.mock'
import { usersMock } from '@/entities/user/mock/users.mock'

export const handlers = [
  http.get('/api/dashboard/stats', async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return HttpResponse.json(dashboardStatsMock)
  }),

  http.get('/api/users', async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return HttpResponse.json(usersMock)
  }),

  http.get('/api/events', async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return HttpResponse.json(eventsMock)
  }),
]
