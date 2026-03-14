import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
  Object.defineProperty(navigator, 'geolocation', {
    value: { getCurrentPosition: vi.fn((_s, error) => error!(new Error('denied'))) },
    writable: true,
  })
})

describe('App', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />)
    expect(container.firstChild).not.toBeNull()
  })
  it('renders SearchBar', () => {
    render(<App />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })
})
