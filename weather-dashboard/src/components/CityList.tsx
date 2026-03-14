import type { CityListProps } from '../types/weather'

export function CityList({ cities, activeCity, onCitySelect, onRemoveCity }: CityListProps) {
  if (cities.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-700/40 bg-slate-900/60 backdrop-blur-md p-4">
        <p className="text-xs font-mono text-slate-500 uppercase tracking-widest text-center">
          No saved cities
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-700/40 bg-gradient-to-b from-slate-900/70 to-slate-900/50 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.35)] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-700/40 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/70" />
        <span className="text-[10px] font-mono tracking-widest uppercase text-slate-500">
          Saved Cities
        </span>
      </div>

      {/* City list */}
      <ul className="divide-y divide-slate-700/30">
        {cities.map((city) => {
          const isActive = activeCity?.id === city.id
          return (
            <li
              key={city.id}
              className={[
                'group relative flex items-center justify-between px-4 py-3',
                'transition-all duration-150',
                isActive
                  ? 'bg-cyan-500/10'
                  : 'hover:bg-slate-800/50',
              ].join(' ')}
            >
              {/* Active indicator bar */}
              {isActive && (
                <div className="absolute left-0 inset-y-0 w-0.5 bg-cyan-400 rounded-r" />
              )}

              {/* City name button */}
              <button
                onClick={() => onCitySelect(city)}
                className={[
                  'flex-1 text-left min-w-0',
                  'transition-colors duration-150',
                  isActive ? 'text-cyan-300' : 'text-slate-300 hover:text-slate-100',
                ].join(' ')}
              >
                <span className="block text-sm font-mono truncate">
                  {city.name}
                </span>
                <span className="block text-[10px] font-mono text-slate-600 uppercase tracking-wider mt-0.5">
                  {city.country}
                </span>
              </button>

              {/* Remove button */}
              <button
                onClick={() => onRemoveCity(city.id)}
                aria-label={`Remove ${city.name}`}
                className={[
                  'ml-3 w-6 h-6 rounded-md flex items-center justify-center shrink-0',
                  'border border-transparent',
                  'text-slate-600',
                  'opacity-0 group-hover:opacity-100',
                  'hover:text-rose-400 hover:border-rose-400/30 hover:bg-rose-400/10',
                  'transition-all duration-150',
                ].join(' ')}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
