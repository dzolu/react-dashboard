import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react'

import { login as loginRequest } from '@/features/auth/api/auth.api'
import type { AuthenticatedUser } from '@/features/auth/model/types'
import { authUnauthorizedEvent } from '@/shared/api/client'

const tokenKey = 'secure-cms-token'
const userKey = 'secure-cms-user'

interface AuthContextValue {
  user: AuthenticatedUser | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function getStoredUser(): AuthenticatedUser | null {
  const stored = localStorage.getItem(userKey)
  const token = localStorage.getItem(tokenKey)
  if (!stored || !token) return null
  try {
    const encodedPayload = token.split('.')[1]
    if (!encodedPayload) throw new Error('Invalid stored token')
    const normalizedPayload = encodedPayload
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(Math.ceil(encodedPayload.length / 4) * 4, '=')
    const payload = JSON.parse(atob(normalizedPayload)) as { exp?: number }
    if (!payload.exp || payload.exp * 1000 <= Date.now()) {
      throw new Error('Stored token has expired')
    }
    return JSON.parse(stored) as AuthenticatedUser
  } catch {
    localStorage.removeItem(userKey)
    localStorage.removeItem(tokenKey)
    return null
  }
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthenticatedUser | null>(getStoredUser)

  useEffect(() => {
    const handleUnauthorized = () => setUser(null)
    window.addEventListener(authUnauthorizedEvent, handleUnauthorized)
    return () =>
      window.removeEventListener(authUnauthorizedEvent, handleUnauthorized)
  }, [])

  const login = async (email: string, password: string) => {
    const response = await loginRequest(email, password)
    localStorage.setItem(tokenKey, response.accessToken)
    localStorage.setItem(userKey, JSON.stringify(response.user))
    setUser(response.user)
  }

  const logout = () => {
    localStorage.removeItem(tokenKey)
    localStorage.removeItem(userKey)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Kept beside the provider so authentication has one public module.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
