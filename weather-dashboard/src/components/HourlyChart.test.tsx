import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { HourlyChart } from './HourlyChart'
import { STUB_WEATHER_DATA } from '../utils/stubData'

describe('HourlyChart', () => {
  it('renders without crashing with valid data', () => {
    const { container } = render(
      <HourlyChart hours={STUB_WEATHER_DATA.hourly} unit="C" />
    )
    expect(container.firstChild).not.toBeNull()
  })

  it('renders with empty hours array without crashing', () => {
    const { container } = render(<HourlyChart hours={[]} unit="C" />)
    expect(container.firstChild).not.toBeNull()
  })
})
