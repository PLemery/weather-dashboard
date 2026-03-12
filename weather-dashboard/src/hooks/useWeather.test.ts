import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useWeather } from './useWeather'
import type { City } from '../types/weather'

const MOCK_CITY: City = {
  id: 'test-id',
  name: 'London',
  latitude: 51.5,
  longitude: -0.12,
  country: 'United Kingdom',
}

const MOCK_API_RESPONSE = {
  current: {
    temperature_2m: 15,
    relative_humidity_2m: 72,
    wind_speed_10m: 20,
    uv_index: 3,
    weather_code: 2,
    time: '2026-03-11T12:00',
  },
  daily: {
    time: ['2026-03-11','2026-03-12','2026-03-13','2026-03-14','2026-03-15','2026-03-16','2026-03-17'],
    weather_code: [2, 61, 3, 0, 1, 80, 0],
    temperature_2m_max: [16, 14, 13, 18, 17, 12, 20],
    temperature_2m_min: [8, 9, 7, 10, 9, 7, 11],
    precipitation_probability_max: [10, 70, 40, 5, 15, 60, 5],
  },
  hourly: {
    time: Array.from({ length: 24 }, (_, i) => `2026-03-11T${String(i).padStart(2, '0')}:00`),
    temperature_2m: Array.from({ length: 24 }, (_, i) => 10 + i * 0.5),
    precipitation: Array.from({ length: 24 }, () => 0),
  },
}

describe('useWeather', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns null data and no loading when city is null', () => {
    const { result } = renderHook(() => useWeather(null))
    expect(result.current.data).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('fetches and maps weather data for a city', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => MOCK_API_RESPONSE,
    } as Response)

    const { result } = renderHook(() => useWeather(MOCK_CITY))
    expect(result.current.loading).toBe(true)

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.data).not.toBeNull()
    expect(result.current.data!.current.temperature).toBe(15)
    expect(result.current.data!.forecast).toHaveLength(7)
    expect(result.current.data!.hourly).toHaveLength(24)
    expect(result.current.error).toBeNull()
  })

  it('sets error on fetch failure', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    } as Response)

    const { result } = renderHook(() => useWeather(MOCK_CITY))
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBeTruthy()
    expect(result.current.data).toBeNull()
  })
})
