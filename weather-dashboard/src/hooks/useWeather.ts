import { useReducer, useEffect } from 'react'
import type { City, WeatherData, CurrentWeather, ForecastDay, HourlyPoint } from '../types/weather'

const BASE_URL = 'https://api.open-meteo.com/v1/forecast'

function buildUrl(city: City): string {
  const params = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,uv_index,weather_code',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    hourly: 'temperature_2m,precipitation',
    timezone: 'auto',
    forecast_days: '7',
  })
  return `${BASE_URL}?${params}`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapResponse(data: any): WeatherData {
  if (!data?.current || !data?.daily || !data?.hourly) {
    throw new Error('Unexpected response shape from weather API')
  }
  const current: CurrentWeather = {
    temperature: data.current.temperature_2m,
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    uvIndex: data.current.uv_index,
    weatherCode: data.current.weather_code,
    time: data.current.time,
  }

  const forecast: ForecastDay[] = data.daily.time.map((date: string, i: number) => ({
    date,
    weatherCode: data.daily.weather_code[i],
    tempMax: data.daily.temperature_2m_max[i],
    tempMin: data.daily.temperature_2m_min[i],
    precipitationProbability: data.daily.precipitation_probability_max[i],
  }))

  const hourly: HourlyPoint[] = data.hourly.time.slice(0, 24).map((time: string, i: number) => ({
    time,
    temperature: data.hourly.temperature_2m[i],
    precipitation: data.hourly.precipitation[i],
  }))

  return { current, forecast, hourly }
}

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: WeatherData }
  | { type: 'FETCH_ERROR'; payload: string }

interface WeatherState {
  data: WeatherData | null
  loading: boolean
  error: string | null
}

const initialState: WeatherState = { data: null, loading: false, error: null }

function reducer(state: WeatherState, action: Action): WeatherState {
  switch (action.type) {
    case 'FETCH_START':
      return { data: null, loading: true, error: null }
    case 'FETCH_SUCCESS':
      return { data: action.payload, loading: false, error: null }
    case 'FETCH_ERROR':
      return { data: null, loading: false, error: action.payload }
    default:
      return state
  }
}

export function useWeather(city: City | null): WeatherState {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    if (!city) return

    let cancelled = false
    dispatch({ type: 'FETCH_START' })

    fetch(buildUrl(city))
      .then((res) => {
        if (!res.ok) throw new Error(`Weather API error: ${res.status}`)
        return res.json()
      })
      .then((json) => {
        if (!cancelled) {
          dispatch({ type: 'FETCH_SUCCESS', payload: mapResponse(json) })
        }
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'Unknown error'
        if (!cancelled) dispatch({ type: 'FETCH_ERROR', payload: message })
      })

    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city?.id])

  if (!city) return initialState
  return state
}
