import '@testing-library/jest-dom/vitest'

import { render, screen } from '@testing-library/react'

import App from '../App'

describe('App', () => {
  it('renders the default Vite React title', () => {
    render(<App />)

    expect(screen.getByText('Vite + React')).toBeInTheDocument()
  })
})
