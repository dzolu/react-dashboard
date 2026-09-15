export type UserRole = 'Editor' | 'Admin'

export interface AuthenticatedUser {
  id: string
  email: string
  displayName: string
  role: UserRole
}

export interface LoginResponse {
  accessToken: string
  expiresAt: string
  user: AuthenticatedUser
}
