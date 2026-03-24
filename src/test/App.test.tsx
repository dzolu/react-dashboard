import '@testing-library/jest-dom/vitest'

import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import App from '@/App'

vi.mock('@/app/routes/AppRouter', () => ({
  AppRouter: () => <div>React Dashboard</div>,
}))

describe('App', () => {
  it('renders the dashboard shell', () => {
    render(<App />)

    expect(screen.getByText('React Dashboard')).toBeInTheDocument()
  })
})
