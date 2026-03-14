import { useState, useEffect, useRef } from 'react'
import type { SearchBarProps, City, GeocodingResult } from '../types/weather'
import { searchCities } from '../utils/weatherHelpers'
import { WiDaySunny } from 'react-icons/wi'

export function SearchBar({ onCitySelect }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GeocodingResult[]>([])
  const [isFocused, setIsFocused] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!query.trim()) {
      debounceRef.current = setTimeout(() => setResults([]), 0)
      return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
    }
    debounceRef.current = setTimeout(() => {
      searchCities(query).then(setResults).catch(() => setResults([]))
    }, 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setResults([])
        setIsFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSelect(result: GeocodingResult) {
    const city: City = {
      id: crypto.randomUUID(),
      name: result.name,
      latitude: result.latitude,
      longitude: result.longitude,
      country: result.country,
    }
    onCitySelect(city)
    setQuery('')
    setResults([])
    setIsFocused(false)
  }

  const showDropdown = results.length > 0 && isFocused

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Search input with glass effect */}
      <div
        className={[
          'relative flex items-center gap-2',
          'rounded-xl border transition-all duration-200',
          'bg-slate-900/60 backdrop-blur-md',
          isFocused
            ? 'border-cyan-400/60 shadow-[0_0_0_1px_rgba(34,211,238,0.15),0_4px_24px_rgba(34,211,238,0.08)]'
            : 'border-slate-700/50 shadow-[0_2px_12px_rgba(0,0,0,0.3)]',
        ].join(' ')}
      >
        {/* Search icon */}
        <div className={[
          'pl-3.5 transition-colors duration-200',
          isFocused ? 'text-cyan-400' : 'text-slate-500',
        ].join(' ')}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search city…"
          aria-label="Search for a city"
          className={[
            'flex-1 py-3 pr-4 bg-transparent outline-none',
            'text-sm text-slate-100 placeholder-slate-500',
            'font-mono tracking-wide',
          ].join(' ')}
        />

        {/* Clear button */}
        {query && (
          <button
            onClick={() => { setQuery(''); setResults([]) }}
            className="pr-3.5 text-slate-500 hover:text-slate-300 transition-colors duration-150"
            aria-label="Clear search"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown results */}
      {showDropdown && (
        <ul
          className={[
            'absolute top-full left-0 right-0 mt-1.5 z-50',
            'rounded-xl border border-slate-700/50',
            'bg-slate-900/95 backdrop-blur-xl',
            'shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.04)]',
            'overflow-hidden',
          ].join(' ')}
        >
          {results.map((r, index) => (
            <li key={`${r.latitude}-${r.longitude}`}>
              <button
                onClick={() => handleSelect(r)}
                className={[
                  'w-full flex items-center justify-between px-4 py-3',
                  'text-left transition-all duration-150',
                  'hover:bg-slate-800/70 group',
                  index !== results.length - 1 ? 'border-b border-slate-800/60' : '',
                ].join(' ')}
              >
                <div className="flex items-center gap-2.5">
                  <WiDaySunny
                    className="text-slate-500 group-hover:text-cyan-400 transition-colors duration-150 shrink-0"
                    size={18}
                  />
                  <span className="text-sm text-slate-200 font-mono tracking-wide group-hover:text-white transition-colors duration-150">
                    {r.name}
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-mono group-hover:text-slate-400 transition-colors duration-150 ml-2 shrink-0">
                  {r.country}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
