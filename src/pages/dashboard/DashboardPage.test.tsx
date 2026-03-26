import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { dashboardStatsMock } from '@/entities/dashboard/mock/dashboard.mock'
import { eventsMock } from '@/entities/event/mock/events.mock'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { createJsonResponse, renderWithProviders } from '@/test/test-utils'

describe('DashboardPage', () => {
  it('renders dashboard stats and recent activity from API responses', async () => {
    const fetchMock = vi.fn((input: RequestInfo | URL) => {
      const url = input.toString()

      if (url === '/api/dashboard/stats') {
        return Promise.resolve(createJsonResponse(dashboardStatsMock))
      }

      if (url === '/api/events') {
        return Promise.resolve(createJsonResponse(eventsMock))
      }

      return Promise.reject(new Error(`Unhandled request: ${url}`))
    })

    vi.stubGlobal('fetch', fetchMock)

    renderWithProviders(<DashboardPage />)

    expect(screen.getByText('Loading dashboard metrics...')).toBeInTheDocument()

    expect(await screen.findByText('1,284')).toBeInTheDocument()
    expect(screen.getByText('+8.2% vs last month')).toBeInTheDocument()
    expect(
      screen.getByText('Olivia Martin created a new workspace.')
    ).toBeInTheDocument()
    expect(screen.getByText('Olivia Martin • user.created')).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledWith('/api/dashboard/stats', undefined)
    expect(fetchMock).toHaveBeenCalledWith('/api/events', undefined)
  })
})
