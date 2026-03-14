import React from 'react'
import * as wi from 'react-icons/wi'
import type { ForecastCardProps } from '../types/weather'
import { celsiusToFahrenheit, wmoCodeToIconName } from '../utils/weatherHelpers'

export function ForecastCard({ day, unit }: ForecastCardProps) {
  const high = unit === 'F' ? celsiusToFahrenheit(day.tempMax) : Math.round(day.tempMax)
  const low = unit === 'F' ? celsiusToFahrenheit(day.tempMin) : Math.round(day.tempMin)
  const iconName = wmoCodeToIconName(day.weatherCode)
  const WeatherIcon = (wi as Record<string, React.ElementType>)[iconName] ?? wi.WiDaySunny
  const dayLabel = new Date(day.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' })

  return (
    <div
      className={[
        'relative flex flex-col items-center gap-2 px-3 py-4',
        'rounded-2xl border border-slate-700/40',
        'bg-gradient-to-b from-slate-800/50 to-slate-900/50',
        'backdrop-blur-md',
        'shadow-[0_4px_20px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.05)]',
        'hover:shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(125,211,252,0.25)]',
        'hover:border-sky-400/30 hover:scale-105',
        'transition-all duration-200 cursor-default',
        'min-w-[72px]',
      ].join(' ')}
    >
      {/* Subtle top highlight — brightens on hover via border change */}
      <div className="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-slate-400/20 to-transparent" />

      {/* Day label */}
      <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400">
        {dayLabel}
      </span>

      {/* Weather icon */}
      <WeatherIcon
        className="text-cyan-300/90 drop-shadow-[0_0_6px_rgba(103,232,249,0.4)]"
        size={36}
      />

      {/* High temp */}
      <span className="text-base font-mono font-medium text-slate-100 tabular-nums leading-none">
        {high}°
      </span>

      {/* Low temp */}
      <span className="text-sm font-mono text-slate-500 tabular-nums leading-none">
        {low}°
      </span>

      {/* Divider */}
      <div className="w-full h-px bg-slate-700/40" />

      {/* Precipitation */}
      <div className="flex items-center gap-1">
        <wi.WiRaindrop className="text-sky-400/70 shrink-0" size={14} />
        <span className="text-[10px] font-mono text-slate-400 tabular-nums">
          {day.precipitationProbability}%
        </span>
      </div>
    </div>
  )
}
