import React from 'react'
import * as wi from 'react-icons/wi'
import type { CurrentWeatherProps } from '../types/weather'
import { celsiusToFahrenheit, wmoCodeToLabel, wmoCodeToIconName } from '../utils/weatherHelpers'

export function CurrentWeather({ data, unit, onToggleUnit }: CurrentWeatherProps) {
  const temp = unit === 'F' ? celsiusToFahrenheit(data.temperature) : Math.round(data.temperature)
  const label = wmoCodeToLabel(data.weatherCode)
  const iconName = wmoCodeToIconName(data.weatherCode)
  const WeatherIcon = (wi as Record<string, React.ElementType>)[iconName] ?? wi.WiDaySunny

  // UV index bar width: max UV ~11, so percentage of 11
  const uvPercent = Math.min(Math.round((data.uvIndex / 11) * 100), 100)

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-700/40 bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.06)]">
      {/* Subtle top highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

      {/* Background glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

      <div className="relative p-6">
        {/* Top row: icon + condition + unit toggle */}
        <div className="flex items-start justify-between mb-4">
          {/* Weather icon + label */}
          <div className="flex flex-col gap-1">
            <WeatherIcon
              className="text-cyan-300 drop-shadow-[0_0_8px_rgba(103,232,249,0.5)]"
              size={56}
            />
            <span className="text-xs text-slate-400 font-mono tracking-widest uppercase">
              {label}
            </span>
          </div>

          {/* Unit toggle — shows the OTHER unit to switch to */}
          <button
            onClick={onToggleUnit}
            className={[
              'px-3 py-1.5 rounded-lg',
              'border border-slate-700/60 bg-slate-800/60',
              'text-xs font-mono tracking-wider',
              'text-slate-300 hover:text-cyan-300 hover:border-cyan-400/40 hover:bg-slate-800/80',
              'transition-all duration-200',
              'shadow-[0_2px_8px_rgba(0,0,0,0.3)]',
            ].join(' ')}
            aria-label={`Switch to °${unit === 'C' ? 'F' : 'C'}`}
          >
            {`Switch to °${unit === 'C' ? 'F' : 'C'}`}
          </button>
        </div>

        {/* Temperature display */}
        <div className="flex items-baseline gap-1 mb-5">
          <span className="text-7xl font-mono font-light tracking-tighter text-white leading-none">
            {temp}
          </span>
          <span className="text-3xl font-mono text-slate-400 leading-none pb-1">{`°${unit}`}</span>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {/* Humidity */}
          <div className="flex flex-col gap-1.5 rounded-xl border border-slate-700/40 bg-slate-800/40 p-3">
            <div className="flex items-center gap-1.5">
              <wi.WiHumidity className="text-cyan-400/70 shrink-0" size={18} />
              <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">Humidity</span>
            </div>
            <span className="text-sm font-mono text-slate-200 tabular-nums">
              {`${data.humidity}%`}
            </span>
          </div>

          {/* Wind */}
          <div className="flex flex-col gap-1.5 rounded-xl border border-slate-700/40 bg-slate-800/40 p-3">
            <div className="flex items-center gap-1.5">
              <wi.WiStrongWind className="text-cyan-400/70 shrink-0" size={18} />
              <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">Wind</span>
            </div>
            <span className="text-sm font-mono text-slate-200 tabular-nums">
              {`${data.windSpeed} km/h`}
            </span>
          </div>

          {/* UV Index — rendered as labelled bar to avoid text collision with humidity */}
          <div className="flex flex-col gap-1.5 rounded-xl border border-slate-700/40 bg-slate-800/40 p-3">
            <div className="flex items-center gap-1.5">
              <wi.WiSolarEclipse className="text-cyan-400/70 shrink-0" size={18} />
              <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">UV</span>
            </div>
            <div
              className="flex items-center gap-2"
              role="meter"
              aria-label={`UV index ${data.uvIndex}`}
              aria-valuenow={data.uvIndex}
              aria-valuemin={0}
              aria-valuemax={11}
            >
              <div className="flex-1 h-1.5 rounded-full bg-slate-700/60 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-amber-400 transition-all duration-500"
                  style={{ width: `${uvPercent}%` }}
                />
              </div>
              <span className="text-xs font-mono text-slate-200 tabular-nums ml-1">{data.uvIndex}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
