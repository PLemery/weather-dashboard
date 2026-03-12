import { describe, it, expect, vi } from 'vitest'
import {
  celsiusToFahrenheit,
  fahrenheitToCelsius,
  wmoCodeToLabel,
  wmoCodeToIconName,
  searchCities,
} from './weatherHelpers'

describe('celsiusToFahrenheit', () => {
  it('converts 0°C to 32°F', () => {
    expect(celsiusToFahrenheit(0)).toBe(32)
  })
  it('converts 100°C to 212°F', () => {
    expect(celsiusToFahrenheit(100)).toBe(212)
  })
})

describe('fahrenheitToCelsius', () => {
  it('converts 32°F to 0°C', () => {
    expect(fahrenheitToCelsius(32)).toBe(0)
  })
  it('converts 212°F to 100°C', () => {
    expect(fahrenheitToCelsius(212)).toBe(100)
  })
})

describe('wmoCodeToLabel', () => {
  it('returns "Clear sky" for code 0', () => {
    expect(wmoCodeToLabel(0)).toBe('Clear sky')
  })
  it('returns "Thunderstorm" for code 95', () => {
    expect(wmoCodeToLabel(95)).toBe('Thunderstorm')
  })
  it('returns "Unknown" for unmapped code', () => {
    expect(wmoCodeToLabel(999)).toBe('Unknown')
  })
})

describe('wmoCodeToIconName', () => {
  it('returns WiDaySunny for code 0', () => {
    expect(wmoCodeToIconName(0)).toBe('WiDaySunny')
  })
})

describe('searchCities', () => {
  it('returns geocoding results for a valid query', async () => {
    const mockResponse = {
      results: [
        { name: 'London', latitude: 51.5, longitude: -0.12, country: 'United Kingdom' },
      ],
    }
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response)

    const results = await searchCities('London')
    expect(results).toHaveLength(1)
    expect(results[0].name).toBe('London')
  })

  it('returns empty array when no results', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    } as Response)

    const results = await searchCities('zzzznotacity')
    expect(results).toEqual([])
  })
})
