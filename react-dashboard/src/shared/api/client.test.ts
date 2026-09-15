import { beforeEach, describe, expect, it, vi } from 'vitest'

import { apiClient, authUnauthorizedEvent } from './client'

describe('apiClient authentication handling', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('clears a stored session and announces expiration after a 401', async () => {
    localStorage.setItem('secure-cms-token', 'expired-token')
    localStorage.setItem('secure-cms-user', '{"id":"editor-1"}')
    const unauthorizedHandler = vi.fn()
    window.addEventListener(authUnauthorizedEvent, unauthorizedHandler, {
      once: true,
    })
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ title: 'Unauthorized' }),
      })
    )

    await expect(apiClient('/api/events')).rejects.toEqual(
      expect.objectContaining({ status: 401 })
    )

    expect(localStorage.getItem('secure-cms-token')).toBeNull()
    expect(localStorage.getItem('secure-cms-user')).toBeNull()
    expect(unauthorizedHandler).toHaveBeenCalledOnce()
  })
})
