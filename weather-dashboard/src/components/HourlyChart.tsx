import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import type { HourlyChartProps } from '../types/weather'
import { celsiusToFahrenheit } from '../utils/weatherHelpers'

export function HourlyChart({ hours, unit }: HourlyChartProps) {
  const data = hours.map((h) => ({
    hour: new Date(h.time).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
    temp: unit === 'F' ? celsiusToFahrenheit(h.temperature) : Math.round(h.temperature),
    precip: h.precipitation,
  }))

  return (
    <div
      className={[
        'relative overflow-hidden rounded-2xl border border-slate-700/40',
        'bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80',
        'backdrop-blur-xl',
        'shadow-[0_8px_40px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.06)]',
        'p-4',
      ].join(' ')}
    >
      {/* Top highlight line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

      {/* Section label */}
      <p className="text-[10px] font-mono tracking-widest uppercase text-slate-500 mb-3 px-1">
        Hourly Temperature
      </p>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(148,163,184,0.08)"
            vertical={false}
          />

          <XAxis
            dataKey="hour"
            tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />

          <YAxis
            tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v}°`}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15,23,42,0.92)',
              border: '1px solid rgba(51,65,85,0.6)',
              borderRadius: '10px',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              padding: '8px 12px',
            }}
            labelStyle={{
              color: '#94a3b8',
              fontSize: '10px',
              fontFamily: 'monospace',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginBottom: '4px',
            }}
            itemStyle={{
              color: '#e2e8f0',
              fontSize: '12px',
              fontFamily: 'monospace',
            }}
            formatter={(val, name) => [
              val,
              name === 'temp' ? `Temp (°${unit})` : 'Precip (mm)',
            ]}
            cursor={{ stroke: 'rgba(34,211,238,0.2)', strokeWidth: 1 }}
          />

          <Area
            type="monotone"
            dataKey="temp"
            stroke="#22d3ee"
            strokeWidth={1.5}
            fill="url(#tempGradient)"
            dot={false}
            activeDot={{ r: 4, fill: '#22d3ee', strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
