export interface ProblemDetails {
  title?: string
  detail?: string
  status?: number
  errors?: Record<string, string[]>
}

export const authUnauthorizedEvent = 'secure-cms:unauthorized'

export class ApiError extends Error {
  readonly status: number
  readonly problem?: ProblemDetails

  constructor(status: number, problem?: ProblemDetails) {
    super(
      problem?.detail ??
        problem?.title ??
        `Request failed with status ${status}`
    )
    this.status = status
    this.problem = problem
  }
}

export async function apiClient<T>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<T> {
  const token = localStorage.getItem('secure-cms-token')
  const headers = new Headers(init?.headers)
  if (token) headers.set('Authorization', `Bearer ${token}`)
  if (init?.body) headers.set('Content-Type', 'application/json')

  const response = await fetch(input, { ...init, headers })

  if (!response.ok) {
    const problem = (await response.json().catch(() => undefined)) as
      | ProblemDetails
      | undefined
    if (response.status === 401 && token) {
      localStorage.removeItem('secure-cms-token')
      localStorage.removeItem('secure-cms-user')
      window.dispatchEvent(new Event(authUnauthorizedEvent))
    }
    throw new ApiError(response.status, problem)
  }

  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}
