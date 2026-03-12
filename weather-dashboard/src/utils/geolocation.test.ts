import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getUserLocation } from './geolocation'

describe('getUserLocation', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('resolves with latitude and longitude on success', async () => {
    const mockPosition = {
      coords: { latitude: 40.7128, longitude: -74.006 },
    }
    vi.spyOn(navigator.geolocation, 'getCurrentPosition').mockImplementation(
      (success) => success(mockPosition as GeolocationPosition)
    )

    const result = await getUserLocation()
    expect(result.latitude).toBe(40.7128)
    expect(result.longitude).toBe(-74.006)
  })

  it('rejects when geolocation is denied', async () => {
    const mockError = new Error('User denied geolocation') as GeolocationPositionError
    vi.spyOn(navigator.geolocation, 'getCurrentPosition').mockImplementation(
      (_success, error) => error!(mockError)
    )

    await expect(getUserLocation()).rejects.toThrow('User denied geolocation')
  })
})
