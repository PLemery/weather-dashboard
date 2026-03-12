import type { GeocodingResult } from '../types/weather'

// ─── Unit Conversion ──────────────────────────────────────────────────────

export function celsiusToFahrenheit(c: number): number {
  return Math.round((c * 9) / 5 + 32)
}

export function fahrenheitToCelsius(f: number): number {
  return Math.round(((f - 32) * 5) / 9)
}

// ─── WMO Code Mapping ────────────────────────────────────────────────────

const WMO_LABELS: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Foggy', 48: 'Icy fog',
  51: 'Light drizzle', 53: 'Drizzle', 55: 'Heavy drizzle',
  56: 'Freezing drizzle', 57: 'Heavy freezing drizzle',
  61: 'Light rain', 63: 'Rain', 65: 'Heavy rain',
  66: 'Freezing rain', 67: 'Heavy freezing rain',
  71: 'Light snow', 73: 'Snow', 75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Rain showers', 81: 'Showers', 82: 'Heavy showers',
  85: 'Snow showers', 86: 'Heavy snow showers',
  95: 'Thunderstorm', 96: 'Thunderstorm with hail', 99: 'Heavy thunderstorm',
}

// All icon names from react-icons/wi — WiDaySunny is the baseline example
const WMO_ICONS: Record<number, string> = {
  0: 'WiDaySunny',
  1: 'WiDaySunny', 2: 'WiDayCloudy', 3: 'WiCloudy',
  45: 'WiFog', 48: 'WiFog',
  51: 'WiSprinkle', 53: 'WiSprinkle', 55: 'WiRain',
  56: 'WiRainMix', 57: 'WiRainMix',
  61: 'WiRain', 63: 'WiRain', 65: 'WiRainMix',
  66: 'WiRainMix', 67: 'WiRainMix',
  71: 'WiSnow', 73: 'WiSnow', 75: 'WiSnowWind',
  77: 'WiSnow',
  80: 'WiShowers', 81: 'WiShowers', 82: 'WiStormShowers',
  85: 'WiSnowWind', 86: 'WiSnowWind',
  95: 'WiThunderstorm', 96: 'WiThunderstorm', 99: 'WiThunderstorm',
}

export function wmoCodeToLabel(code: number): string {
  return WMO_LABELS[code] ?? 'Unknown'
}

export function wmoCodeToIconName(code: number): string {
  return WMO_ICONS[code] ?? 'WiDaySunny'
}

// ─── Geocoding (stub — implemented by Agent 2) ───────────────────────────

export async function searchCities(_query: string): Promise<GeocodingResult[]> {
  throw new Error('searchCities: not yet implemented — Agent 2 will fill this in')
}
