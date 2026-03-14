import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CityList } from './CityList'
import type { City } from '../types/weather'

const CITIES: City[] = [
  { id: '1', name: 'London', latitude: 51.5, longitude: -0.12, country: 'UK' },
  { id: '2', name: 'Paris', latitude: 48.85, longitude: 2.35, country: 'France' },
]

describe('CityList', () => {
  it('renders all city names', () => {
    render(<CityList cities={CITIES} activeCity={CITIES[0]} onCitySelect={vi.fn()} onRemoveCity={vi.fn()} />)
    expect(screen.getByText('London')).toBeInTheDocument()
    expect(screen.getByText('Paris')).toBeInTheDocument()
  })

  it('calls onCitySelect when a city is clicked', async () => {
    const onSelect = vi.fn()
    render(<CityList cities={CITIES} activeCity={null} onCitySelect={onSelect} onRemoveCity={vi.fn()} />)
    await userEvent.click(screen.getByText('Paris'))
    expect(onSelect).toHaveBeenCalledWith(CITIES[1])
  })

  it('calls onRemoveCity with the correct id', async () => {
    const onRemove = vi.fn()
    render(<CityList cities={CITIES} activeCity={null} onCitySelect={vi.fn()} onRemoveCity={onRemove} />)
    const removeButtons = screen.getAllByRole('button', { name: /remove/i })
    await userEvent.click(removeButtons[0])
    expect(onRemove).toHaveBeenCalledWith('1')
  })

  it('renders empty state when no cities', () => {
    render(<CityList cities={[]} activeCity={null} onCitySelect={vi.fn()} onRemoveCity={vi.fn()} />)
    expect(screen.getByText(/no saved cities/i)).toBeInTheDocument()
  })
})
