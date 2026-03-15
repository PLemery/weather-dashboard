import { useState, useEffect, useCallback } from 'react'
import { SearchBar } from './components/SearchBar'
import { CurrentWeather } from './components/CurrentWeather'
import { ForecastCard } from './components/ForecastCard'
import { HourlyChart } from './components/HourlyChart'
import { CityList } from './components/CityList'
import { useWeather } from './hooks/useWeather'
import { getUserLocation } from './utils/geolocation'
import type { City } from './types/weather'

const STORAGE_KEY = 'weather-dashboard-cities'

function getThemeClass(code: number | undefined): string {
  if (code === undefined) return 'bg-gray-900'
  if (code === 0 || code === 1) return 'bg-gradient-to-br from-sky-400 to-blue-600'
  if (code === 2 || code === 3) return 'bg-gradient-to-br from-slate-400 to-slate-600'
  if (code >= 45 && code <= 48) return 'bg-gradient-to-br from-gray-400 to-gray-600'
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'bg-gradient-to-br from-blue-700 to-slate-800'
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'bg-gradient-to-br from-slate-100 to-blue-200 text-slate-800'
  if (code >= 95) return 'bg-gradient-to-br from-purple-900 to-slate-900'
  return 'bg-gray-900'
}

function App() {
  const [savedCities, setSavedCities] = useState<City[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') }
    catch { return [] }
  })
  const [activeCity, setActiveCity] = useState<City | null>(() => {
    try {
      const cities: City[] = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
      return cities[0] ?? null
    } catch { return null }
  })
  const [unit, setUnit] = useState<'C' | 'F'>('F')
  const { data, loading, error } = useWeather(activeCity)

  const handleCitySelect = useCallback((city: City) => {
    setActiveCity(city)
    setSavedCities((prev) => prev.some((c) => c.id === city.id) ? prev : [...prev, city])
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedCities))
  }, [savedCities])

  useEffect(() => {
    getUserLocation()
      .then(({ latitude, longitude }) =>
        fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`)
          .then((r) => r.json())
          .then((place) => handleCitySelect({
            id: crypto.randomUUID(),
            name: place.city || place.locality || place.principalSubdivision || 'My Location',
            latitude,
            longitude,
            country: place.countryName ?? '',
            admin1: place.principalSubdivision || undefined,
          }))
      )
      .catch(() => {})
  }, [handleCitySelect])

  return (
    <div className={`min-h-screen transition-all duration-700 ${getThemeClass(data?.current.weatherCode)}`}>
      {/* Noise texture overlay for depth */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px',
        }}
      />

      {/* Ambient glow blobs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />

      {/* Main layout container */}
      <div className="relative min-h-screen max-w-6xl mx-auto px-4 py-8 flex flex-col gap-6">

        {/* Top bar: search + title */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-[10px] font-mono tracking-[0.3em] uppercase text-slate-400 mb-0.5">
              Weather Dashboard
            </h1>
          </div>
          <div className="w-full sm:w-80">
            <SearchBar onCitySelect={handleCitySelect} />
          </div>
        </header>

        {/* Main content grid */}
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-6 items-start">

          {/* Left: weather content */}
          <div className="flex flex-col gap-5 min-w-0">

            {/* Loading state */}
            {loading && !data && (
              <div className="flex items-center gap-3 rounded-2xl border border-slate-700/40 bg-slate-900/60 backdrop-blur-md p-6">
                <div className="w-4 h-4 rounded-full border-2 border-cyan-400/40 border-t-cyan-400 animate-spin" />
                <span className="text-sm font-mono text-slate-400">Fetching weather data…</span>
              </div>
            )}

            {/* Error state */}
            {error && !data && (
              <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 backdrop-blur-md p-4">
                <p className="text-sm font-mono text-rose-300">{error}</p>
              </div>
            )}

            {/* No city selected state */}
            {!activeCity && !loading && (
              <div className="rounded-2xl border border-slate-700/30 bg-slate-900/40 backdrop-blur-md p-8 text-center">
                <div className="text-4xl mb-3 opacity-30">⛅</div>
                <p className="text-sm font-mono text-slate-400">Search for a city to get started</p>
              </div>
            )}

            {/* Weather data */}
            {data && (
              <>
                {/* Current conditions */}
                <CurrentWeather data={data.current} unit={unit} onToggleUnit={() => setUnit(u => u === 'C' ? 'F' : 'C')} />

                {/* 7-day forecast strip */}
                <div>
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <div className="w-1 h-1 rounded-full bg-cyan-400/50" />
                    <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400">
                      7-Day Forecast
                    </span>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {data.forecast.map((day) => (
                      <ForecastCard key={day.date} day={day} unit={unit} />
                    ))}
                  </div>
                </div>

                {/* Hourly temperature chart */}
                <div>
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <div className="w-1 h-1 rounded-full bg-cyan-400/50" />
                    <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400">
                      Hourly Trend
                    </span>
                  </div>
                  <HourlyChart hours={data.hourly} unit={unit} />
                </div>
              </>
            )}
          </div>

          {/* Right sidebar: saved cities */}
          <aside className="lg:sticky lg:top-8">
            <div className="flex items-center gap-2 mb-3 px-1">
              <div className="w-1 h-1 rounded-full bg-cyan-400/50" />
              <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400">
                Favorites
              </span>
            </div>
            <CityList
              cities={savedCities}
              activeCity={activeCity}
              onCitySelect={setActiveCity}
              onRemoveCity={(id) => {
                setSavedCities((prev) => prev.filter((c) => c.id !== id))
                if (activeCity?.id === id) setActiveCity(null)
              }}
            />
          </aside>
        </main>
      </div>
    </div>
  )
}

export default App
