import type { LoginResponse } from '@/features/auth/model/types'
import { apiClient } from '@/shared/api/client'

export function login(email: string, password: string) {
  return apiClient<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}
