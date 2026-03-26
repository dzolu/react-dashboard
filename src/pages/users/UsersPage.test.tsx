import { screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { usersMock } from '@/entities/user/mock/users.mock'
import { UsersPage } from '@/pages/users/UsersPage'
import { createJsonResponse, renderWithProviders } from '@/test/test-utils'

describe('UsersPage', () => {
  it('renders users table rows from API response', async () => {
    const fetchMock = vi.fn((input: RequestInfo | URL) => {
      const url = input.toString()

      if (url === '/api/users') {
        return Promise.resolve(createJsonResponse(usersMock))
      }

      return Promise.reject(new Error(`Unhandled request: ${url}`))
    })

    vi.stubGlobal('fetch', fetchMock)

    renderWithProviders(<UsersPage />)

    expect(screen.getByText('Loading users...')).toBeInTheDocument()

    expect(await screen.findByRole('table')).toBeInTheDocument()

    const oliviaRow = screen.getByText('Olivia Martin').closest('tr')

    expect(oliviaRow).not.toBeNull()
    expect(
      within(oliviaRow as HTMLTableRowElement).getByText('active')
    ).toBeInTheDocument()
    expect(
      within(oliviaRow as HTMLTableRowElement).getByText('admin')
    ).toBeInTheDocument()
    expect(
      within(oliviaRow as HTMLTableRowElement).getByText(
        'olivia.martin@examplse.com'
      )
    ).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledWith('/api/users', undefined)
  })
})
