# Weather Dashboard — Multi-Agent Design Spec
**Date:** 2026-03-11
**Stack:** React + TypeScript + Tailwind CSS + Open-Meteo API

---

## Overview

A production-grade weather dashboard built using a two-phase multi-agent approach. One foundation agent scaffolds the project and defines all shared contracts, then three parallel UI agents and one data agent build their respective subsystems simultaneously.

---

## Architecture

### Shared Contracts (owned by Agent 1)

All agents depend on these. They must be complete before Phase 2 begins.

**`src/types/weather.ts`**

```ts
interface GeocodingResult {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
}

interface CurrentWeather {
  temperature: number;       // in Celsius
  humidity: number;          // percent
  windSpeed: number;         // km/h
  uvIndex: number;
  weatherCode: number;       // WMO code
  time: string;              // ISO string
}

interface ForecastDay {
  date: string;              // ISO date string
  weatherCode: number;
  tempMax: number;           // Celsius
  tempMin: number;           // Celsius
  precipitationProbability: number; // percent
}

interface HourlyPoint {
  time: string;              // ISO string
  temperature: number;       // Celsius
  precipitation: number;     // mm
}

interface WeatherData {
  current: CurrentWeather;
  forecast: ForecastDay[];
  hourly: HourlyPoint[];
}

interface City {
  id: string;                // use crypto.randomUUID()
  name: string;
  latitude: number;
  longitude: number;
  country: string;
}
```

**Component prop interfaces (also in `src/types/weather.ts`):**

```ts
interface SearchBarProps {
  onCitySelect: (city: City) => void;
}

interface CurrentWeatherProps {
  data: CurrentWeather;
  unit: 'C' | 'F';
  onToggleUnit: () => void;
}

interface ForecastCardProps {
  day: ForecastDay;
  unit: 'C' | 'F';
}

interface HourlyChartProps {
  hours: HourlyPoint[];
  unit: 'C' | 'F';
}

interface CityListProps {
  cities: City[];
  activeCity: City | null;
  onCitySelect: (city: City) => void;
  onRemoveCity: (id: string) => void;
}
```

**`src/utils/weatherHelpers.ts`** (Agent 1 creates; Agent 2 appends `searchCities`):

```ts
// Unit conversion
export function celsiusToFahrenheit(c: number): number
export function fahrenheitToCelsius(f: number): number

// WMO weather code mapping
export function wmoCodeToLabel(code: number): string
// Returns react-icons/wi icon name, e.g. wmoCodeToIconName(0) → 'WiDaySunny'
// Agent 1 must include at least one example mapping so all UI agents align on naming convention
export function wmoCodeToIconName(code: number): string

// Stub added by Agent 1 — implementation filled in by Agent 2
export async function searchCities(query: string): Promise<GeocodingResult[]> {
  throw new Error('Not yet implemented');
}
```

**`src/utils/stubData.ts`** (Agent 1 creates):

```ts
// Inline stubs typed against shared interfaces for use by Agents 3 and 4
export const STUB_CURRENT_WEATHER: CurrentWeather = { ... }
export const STUB_FORECAST: ForecastDay[] = [ ... ]  // 7 days
export const STUB_HOURLY: HourlyPoint[] = [ ... ]    // 24 hours
export const STUB_WEATHER_DATA: WeatherData = {
  current: STUB_CURRENT_WEATHER,
  forecast: STUB_FORECAST,
  hourly: STUB_HOURLY,
}
```

---

## Phase 1: Foundation Agent

**Agent 1 — Foundation & Scaffold**

Responsibilities:
1. Scaffold project: `npm create vite@latest weather-dashboard -- --template react-ts`
2. Install dependencies: `npm install recharts react-icons`
3. Use native `fetch` for all API calls — do not install axios
4. Install and configure Tailwind CSS with `tailwind.config.js` and directives in `src/index.css`
5. Write `src/types/weather.ts` with all interfaces above (types + component props)
6. Write `src/utils/weatherHelpers.ts` with unit conversion, WMO mapping, and stub `searchCities`
7. Write `src/utils/stubData.ts` with typed stub data for all interfaces
8. Write `src/utils/geolocation.ts` (owned by Agent 1, implemented by Agent 2)
9. Create a placeholder `src/App.tsx` with a basic layout shell (header, main content area)
10. Leave `src/main.tsx` as Vite's default — do not modify
11. Verify dev server runs: `npm run dev`

**Deliverable:** Running skeleton app, no real UI, all type contracts in place, all stubs available.

---

## Phase 2: Parallel Agents

All four Phase 2 agents start simultaneously after Agent 1 completes.

---

### Agent 2 — Data Layer

**No frontend-design skill required.**

Responsibilities:

- **`src/utils/geolocation.ts`** — replaces Agent 1's stub:
  ```ts
  export async function getUserLocation(): Promise<{ latitude: number; longitude: number }>
  ```
  Uses `navigator.geolocation.getCurrentPosition`.

- **`src/utils/weatherHelpers.ts`** — replaces the stub `searchCities` with real implementation:
  ```ts
  export async function searchCities(query: string): Promise<GeocodingResult[]>
  // Calls: https://geocoding-api.open-meteo.com/v1/search?name={query}&count=5
  // Uses native fetch
  ```

- **`src/hooks/useWeather.ts`**:
  ```ts
  function useWeather(city: City | null): {
    data: WeatherData | null;
    loading: boolean;
    error: string | null;
  }
  // When city is null, return { data: null, loading: false, error: null } immediately
  ```
  Fetches from:
  ```
  https://api.open-meteo.com/v1/forecast
    ?latitude={lat}
    &longitude={lon}
    &current=temperature_2m,relative_humidity_2m,wind_speed_10m,uv_index,weather_code
    &daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max
    &hourly=temperature_2m,precipitation
    &timezone=auto
    &forecast_days=7
  ```
  Maps API response to `WeatherData` using the shared interfaces.

**Coordination note:** Agent 2 is the only Phase 2 agent that writes to `weatherHelpers.ts`. It replaces the stub body of `searchCities` only.

---

### Agent 3 — Current Weather UI

**Invoke `frontend-design` skill before writing any components.**

Responsibilities:

- **`src/components/SearchBar.tsx`**:
  - Props: `SearchBarProps`
  - Debounced text input calling `searchCities()` from `weatherHelpers.ts`
  - Dropdown of `GeocodingResult` items; on select, creates a `City` and calls `onCitySelect`
  - Import `searchCities` from `weatherHelpers.ts` — it may throw during parallel development; handle gracefully

- **`src/components/CurrentWeather.tsx`**:
  - Props: `CurrentWeatherProps`
  - Displays: temperature (converted via helpers), weather label (from `wmoCodeToLabel`), humidity, wind speed, UV index
  - Renders the °F/°C toggle button, calls `onToggleUnit`
  - Weather icon using icon name from `wmoCodeToIconName` + `react-icons`

- Use `STUB_WEATHER_DATA` from `src/utils/stubData.ts` for development rendering
- Does not touch `App.tsx`

---

### Agent 4 — Forecast UI

**Invoke `frontend-design` skill before writing any components.**

Responsibilities:

- **`src/components/ForecastCard.tsx`**:
  - Props: `ForecastCardProps`
  - Displays: formatted date, weather icon, high/low temps (converted via helpers), precipitation probability
  - Designed to render in a horizontal scrollable row of 7

- **`src/components/HourlyChart.tsx`**:
  - Props: `HourlyChartProps`
  - `recharts` `AreaChart` showing temperature over 24 hours
  - X-axis: hour labels formatted from ISO time strings
  - Y-axis: temperature (converted per unit)
  - Tooltip showing temperature + precipitation on hover

- Use `STUB_WEATHER_DATA` from `src/utils/stubData.ts` for development rendering
- Does not touch `App.tsx`

---

### Agent 5 — App Shell, Themes & Favorites

**Invoke `frontend-design` skill before writing any components.**

Responsibilities:

- **`src/components/CityList.tsx`**:
  - Props: `CityListProps`
  - Renders list of saved cities; highlights active city
  - Add city (receives a `City` from parent), remove city by `id`
  - Persistence handled in `App.tsx` via `localStorage`, not inside this component

- **`src/App.tsx`** (final assembly — replaces Agent 1's placeholder):
  - Manages state: `activeCity: City | null`, `unit: 'C' | 'F'`, `savedCities: City[]`
  - Loads `savedCities` from `localStorage` on mount; syncs on change
  - Calls `getUserLocation()` from `geolocation.ts` on mount to set initial city
  - Wires `useWeather(activeCity)` hook
  - `onCitySelect` from `SearchBar` does two things: sets `activeCity` AND adds city to `savedCities` if not already present
  - Renders: `SearchBar`, `CurrentWeather`, 7 × `ForecastCard`, `HourlyChart`, `CityList`

- **Dynamic themes:**
  - Map WMO weather code groups to Tailwind background/gradient classes:
    - Clear (0-1): bright sky gradient
    - Partly cloudy (2-3): muted sky
    - Foggy (45-48): grey
    - Rainy (51-67, 80-82): cool blue/grey
    - Snowy (71-77, 85-86): white/ice blue
    - Stormy (95-99): deep purple/dark
  - Apply as a dynamic class on the root `div` in `App.tsx`
  - Smooth transition with Tailwind `transition-all duration-700`

- **Animated icons:**
  - Use CSS keyframe animations (defined in `src/index.css`) on `react-icons` SVGs
  - Examples: rotate for wind, pulse for rain, spin-slow for sun

---

## Coordination Rules

1. Agents 3, 4, 5 import types exclusively from `src/types/weather.ts` — no local type redefinition
2. Agents 3, 4, 5 import utilities exclusively from `src/utils/weatherHelpers.ts` and `src/utils/stubData.ts`
3. Agent 2 is the only Phase 2 agent that modifies `weatherHelpers.ts` (replaces `searchCities` stub body only)
4. Only Agent 5 modifies `App.tsx`
5. All UI agents invoke the `frontend-design` skill before writing components
6. All API calls use native `fetch` — do not use axios
7. All imports use relative paths (e.g., `../types/weather`) — no path aliases

---

## File Ownership Map

| File | Owner |
|------|-------|
| `src/types/weather.ts` | Agent 1 |
| `src/utils/weatherHelpers.ts` | Agent 1 (creates) + Agent 2 (fills `searchCities` stub) |
| `src/utils/stubData.ts` | Agent 1 |
| `src/utils/geolocation.ts` | Agent 1 (stub) + Agent 2 (implementation) |
| `src/hooks/useWeather.ts` | Agent 2 |
| `src/components/SearchBar.tsx` | Agent 3 |
| `src/components/CurrentWeather.tsx` | Agent 3 |
| `src/components/ForecastCard.tsx` | Agent 4 |
| `src/components/HourlyChart.tsx` | Agent 4 |
| `src/components/CityList.tsx` | Agent 5 |
| `src/App.tsx` | Agent 1 (placeholder) → Agent 5 (final) |
| `src/index.css` | Agent 1 (Tailwind directives + icon animation keyframes) |
| `tailwind.config.js` | Agent 1 |
| `vite.config.ts` | Agent 1 (leave as Vite default) |
| `tsconfig.json` | Agent 1 (leave as Vite default) |
| `src/main.tsx` | Agent 1 (leave as Vite default) |

---

## Agent 5 Scope Note

Agent 5 has the largest scope (CityList + full App assembly + theming + animation). This agent is the critical integration path. Allocate additional tokens/time budget if orchestrating manually, or consider moving `CityList.tsx` to Agent 3 if load balancing is needed.

---

## Success Criteria

- [ ] App loads and auto-detects user location
- [ ] City search returns results and switches active city
- [ ] Current conditions display with correct data
- [ ] 7-day forecast cards render correctly
- [ ] Hourly chart renders with recharts
- [ ] Favorite cities persist across page refreshes
- [ ] °F/°C toggle works globally
- [ ] Dynamic background changes with weather condition
- [ ] Weather icons animate via CSS keyframes
- [ ] No TypeScript errors (`tsc --noEmit` passes)
- [ ] Dev server runs without errors (`npm run dev`)
- [ ] Production build succeeds (`npm run build`)
