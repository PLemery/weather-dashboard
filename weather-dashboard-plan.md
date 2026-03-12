# Weather Dashboard — Project Plan

## Stack
- **React + TypeScript** (frontend framework)
- **Tailwind CSS** (styling)
- **Open-Meteo API** (weather data — free, no API key required)

## Core Features
- [ ] Geolocation — auto-detect city on load
- [ ] City search + save multiple favorite cities
- [ ] Current conditions (temp, humidity, wind speed, UV index)
- [ ] 7-day forecast
- [ ] Hourly forecast chart
- [ ] °F / °C unit toggle
- [ ] Dynamic backgrounds or themes based on weather (sunny, rainy, cloudy, etc.)
- [ ] Animated weather icons

## Suggested Libraries
- `recharts` or `chart.js` — for the hourly forecast chart
- `react-icons` or `weather-icons` — for animated/styled weather icons
- `axios` or native `fetch` — for API calls

## API
- **Open-Meteo**: https://open-meteo.com/
  - No API key needed
  - Endpoint example: `https://api.open-meteo.com/v1/forecast?latitude=35&longitude=139&hourly=temperature_2m`
  - Geocoding (city name → lat/lon): `https://geocoding-api.open-meteo.com/v1/search?name=London`

## Project Structure (suggested)
```
weather-dashboard/
├── public/
├── src/
│   ├── components/
│   │   ├── SearchBar.tsx
│   │   ├── CurrentWeather.tsx
│   │   ├── ForecastCard.tsx
│   │   ├── HourlyChart.tsx
│   │   └── CityList.tsx
│   ├── hooks/
│   │   └── useWeather.ts       # custom hook for API calls
│   ├── types/
│   │   └── weather.ts          # TypeScript interfaces for API responses
│   ├── utils/
│   │   └── weatherHelpers.ts   # unit conversion, icon mapping, etc.
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## Setup Steps (when ready to start)
1. `npm create vite@latest weather-dashboard -- --template react-ts`
2. `cd weather-dashboard && npm install`
3. Install Tailwind: `npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p`
4. Install chart library: `npm install recharts`
5. Configure Tailwind in `tailwind.config.js` and add directives to `index.css`
6. Start dev server: `npm run dev`

## Build Order (recommended)
1. Get geolocation + basic API call working, log data to console
2. Display current conditions (temp, description, humidity, wind)
3. Add city search using the geocoding API
4. Build the 7-day forecast cards
5. Add the hourly chart
6. Save favorite cities to localStorage
7. °F / °C toggle
8. Dynamic backgrounds/themes
9. Polish UI and animated icons last
