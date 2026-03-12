import type { WeatherData, CurrentWeather, ForecastDay, HourlyPoint } from '../types/weather'

const ANCHOR = new Date('2026-03-11T00:00:00Z')

export const STUB_CURRENT_WEATHER: CurrentWeather = {
  temperature: 22,
  humidity: 55,
  windSpeed: 14,
  uvIndex: 5,
  weatherCode: 2,
  time: ANCHOR.toISOString(),
}

export const STUB_FORECAST: ForecastDay[] = Array.from({ length: 7 }, (_, i) => ({
  date: new Date(ANCHOR.getTime() + i * 86400000).toISOString().split('T')[0],
  weatherCode: [0, 2, 61, 3, 80, 0, 1][i],
  tempMax: 24 - i,
  tempMin: 14 - i,
  precipitationProbability: [5, 10, 70, 40, 60, 5, 15][i],
}))

export const STUB_HOURLY: HourlyPoint[] = Array.from({ length: 24 }, (_, i) => ({
  time: new Date(ANCHOR.getTime() + i * 3600000).toISOString(),
  temperature: 15 + Math.round(8 * Math.sin((i - 6) * Math.PI / 12)),
  precipitation: i >= 10 && i <= 14 ? 0.5 : 0,
}))

export const STUB_WEATHER_DATA: WeatherData = {
  current: STUB_CURRENT_WEATHER,
  forecast: STUB_FORECAST,
  hourly: STUB_HOURLY,
}
