import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchBar } from './SearchBar'
import * as helpers from '../utils/weatherHelpers'

describe('SearchBar', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('renders a search input', () => {
    render(<SearchBar onCitySelect={vi.fn()} />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('shows city results after typing', async () => {
    vi.spyOn(helpers, 'searchCities').mockResolvedValue([
      { name: 'London', latitude: 51.5, longitude: -0.12, country: 'United Kingdom' },
    ])
    render(<SearchBar onCitySelect={vi.fn()} />)
    await userEvent.type(screen.getByRole('textbox'), 'Lon')
    await waitFor(() => {
      expect(screen.getByText('London')).toBeInTheDocument()
    })
  })

  it('calls onCitySelect when a result is clicked', async () => {
    const onSelect = vi.fn()
    vi.spyOn(helpers, 'searchCities').mockResolvedValue([
      { name: 'Paris', latitude: 48.85, longitude: 2.35, country: 'France' },
    ])
    render(<SearchBar onCitySelect={onSelect} />)
    await userEvent.type(screen.getByRole('textbox'), 'Par')
    await waitFor(() => screen.getByText('Paris'))
    await userEvent.click(screen.getByText('Paris'))
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Paris', latitude: 48.85 })
    )
  })
})
