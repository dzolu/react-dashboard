import type { User } from '@/entities/user/model/types'
import { apiClient } from '@/shared/api/client.ts'

export function getUsers() {
  return apiClient<User[]>('/api/users')
}
