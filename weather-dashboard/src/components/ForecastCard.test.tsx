import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ForecastCard } from './ForecastCard'
import { STUB_WEATHER_DATA } from '../utils/stubData'

describe('ForecastCard', () => {
  const day = STUB_WEATHER_DATA.forecast[0]

  it('renders high and low temperatures in Celsius', () => {
    render(<ForecastCard day={day} unit="C" />)
    expect(screen.getByText(new RegExp(String(day.tempMax)))).toBeInTheDocument()
    expect(screen.getByText(new RegExp(String(day.tempMin)))).toBeInTheDocument()
  })

  it('converts temperatures to Fahrenheit when unit is F', () => {
    render(<ForecastCard day={day} unit="F" />)
    // 24°C = 75°F, 14°C = 57°F
    expect(screen.getByText(/75/)).toBeInTheDocument()
    expect(screen.getByText(/57/)).toBeInTheDocument()
  })

  it('renders precipitation probability', () => {
    render(<ForecastCard day={day} unit="C" />)
    expect(screen.getByText(new RegExp(String(day.precipitationProbability)))).toBeInTheDocument()
  })
})
