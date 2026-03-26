export type UserStatus = 'active' | 'invited' | 'suspended'
export type UserRole = 'admin' | 'member' | 'viewer'
export type SubscriptionPlan = 'free' | 'starter' | 'pro' | 'enterprise'

export interface User {
  id: string
  fullName: string
  email: string
  status: UserStatus
  role: UserRole
  plan: SubscriptionPlan
  createdAt: string
  lastActiveAt: string | null
}
