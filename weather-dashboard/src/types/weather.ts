// ─── API / Domain Types ────────────────────────────────────────────────────

export interface GeocodingResult {
  name: string
  latitude: number
  longitude: number
  country: string
  admin1?: string  // state / province
}

export interface CurrentWeather {
  temperature: number          // Celsius
  humidity: number             // percent
  windSpeed: number            // km/h
  uvIndex: number
  weatherCode: number          // WMO weather code
  time: string                 // ISO datetime string
}

export interface ForecastDay {
  date: string                         // ISO date string (YYYY-MM-DD)
  weatherCode: number
  tempMax: number                      // Celsius
  tempMin: number                      // Celsius
  precipitationProbability: number     // percent
}

export interface HourlyPoint {
  time: string          // ISO datetime string
  temperature: number   // Celsius
  precipitation: number // mm
}

export interface WeatherData {
  current: CurrentWeather
  forecast: ForecastDay[]   // 7 days
  hourly: HourlyPoint[]     // 24 hours
}

export interface City {
  id: string            // crypto.randomUUID()
  name: string
  latitude: number
  longitude: number
  country: string
  admin1?: string       // state / province
}

// ─── Component Prop Types ──────────────────────────────────────────────────

export interface SearchBarProps {
  onCitySelect: (city: City) => void
}

export interface CurrentWeatherProps {
  data: CurrentWeather
  unit: 'C' | 'F'
  onToggleUnit: () => void
}

export interface ForecastCardProps {
  day: ForecastDay
  unit: 'C' | 'F'
}

export interface HourlyChartProps {
  hours: HourlyPoint[]
  unit: 'C' | 'F'
}

export interface CityListProps {
  cities: City[]
  activeCity: City | null
  onCitySelect: (city: City) => void
  onRemoveCity: (id: string) => void
}
