import { describe, it, expect } from 'vitest'
import {
  celsiusToFahrenheit,
  fahrenheitToCelsius,
  wmoCodeToLabel,
  wmoCodeToIconName,
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
