import type { WeatherData } from '../types/weather'

export const STUB_WEATHER_DATA: WeatherData = {
  current: {
    temperature: 22,
    humidity: 55,
    windSpeed: 14,
    uvIndex: 5,
    weatherCode: 2,
    time: new Date().toISOString(),
  },
  forecast: Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() + i * 86400000).toISOString().split('T')[0],
    weatherCode: [0, 2, 61, 3, 80, 0, 1][i],
    tempMax: 24 - i,
    tempMin: 14 - i,
    precipitationProbability: [5, 10, 70, 40, 60, 5, 15][i],
  })),
  hourly: Array.from({ length: 24 }, (_, i) => ({
    time: new Date(new Date().setHours(i, 0, 0, 0)).toISOString(),
    temperature: 15 + Math.round(8 * Math.sin((i - 6) * Math.PI / 12)),
    precipitation: i >= 10 && i <= 14 ? 0.5 : 0,
  })),
}
