import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CurrentWeather } from './CurrentWeather'
import { STUB_CURRENT_WEATHER } from '../utils/stubData'

describe('CurrentWeather', () => {
  it('renders temperature in Celsius', () => {
    render(<CurrentWeather data={STUB_CURRENT_WEATHER} unit="C" onToggleUnit={vi.fn()} />)
    expect(screen.getByText(/22/)).toBeInTheDocument()
    expect(screen.getByText(/°C/i)).toBeInTheDocument()
  })

  it('renders temperature in Fahrenheit when unit is F', () => {
    render(<CurrentWeather data={STUB_CURRENT_WEATHER} unit="F" onToggleUnit={vi.fn()} />)
    // 22°C = 72°F
    expect(screen.getByText(/72/)).toBeInTheDocument()
    expect(screen.getByText(/°F/i)).toBeInTheDocument()
  })

  it('calls onToggleUnit when toggle button is clicked', async () => {
    const onToggle = vi.fn()
    render(<CurrentWeather data={STUB_CURRENT_WEATHER} unit="C" onToggleUnit={onToggle} />)
    await userEvent.click(screen.getByRole('button'))
    expect(onToggle).toHaveBeenCalledOnce()
  })

  it('renders humidity, wind speed, and UV index', () => {
    render(<CurrentWeather data={STUB_CURRENT_WEATHER} unit="C" onToggleUnit={vi.fn()} />)
    expect(screen.getByText(/55/)).toBeInTheDocument() // humidity
    expect(screen.getByText(/14/)).toBeInTheDocument() // wind
    expect(screen.getByRole('meter', { name: /UV index/i })).toBeInTheDocument()
  })
})
