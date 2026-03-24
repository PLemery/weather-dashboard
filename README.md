# Weather Dashboard

**Live demo: [weather-dashboard-r3uj.onrender.com](https://weather-dashboard-r3uj.onrender.com)**

A weather dashboard built with React and TypeScript. Search for any city, save favorites, and get current conditions, a 7-day forecast, and an hourly temperature chart — all from a free API with no key required.

## Features

- **Auto-detects your location** on load and shows local weather
- **City search** with live results — shows city, state, and country
- **Save multiple cities** and switch between them instantly
- **Current conditions** — temperature, humidity, wind speed, and UV index
- **7-day forecast** with high/low temps and weather icons
- **Hourly temperature chart** for the next 24 hours
- **°F / °C toggle** — wind speed switches between mph and km/h automatically
- **Dynamic themes** — background changes based on weather conditions (sunny, cloudy, rainy, snowy, etc.)
- **WMO weather icons** that match the current conditions

## Tech Stack

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Vite](https://vitejs.dev/) for builds
- [Recharts](https://recharts.org/) for the hourly chart
- [react-icons/wi](https://react-icons.github.io/react-icons/icons/wi/) for weather icons
- [Open-Meteo API](https://open-meteo.com/) — weather data, free, no API key
- [BigDataCloud API](https://www.bigdatacloud.com/) — reverse geocoding, free, no API key

## Project Structure

```
weather-dashboard/src/
├── components/
│   ├── SearchBar.tsx        # city search input with live dropdown
│   ├── CurrentWeather.tsx   # current conditions display
│   ├── ForecastCard.tsx     # 7-day forecast cards
│   ├── HourlyChart.tsx      # 24-hour temperature chart
│   └── CityList.tsx         # saved cities sidebar
├── hooks/
│   └── useWeather.ts        # data fetching and state management
├── types/
│   └── weather.ts           # TypeScript interfaces for API responses
├── utils/
│   ├── weatherHelpers.ts    # unit conversion, WMO icon mapping, themes
│   └── geolocation.ts       # browser geolocation + reverse geocoding
├── App.tsx
└── main.tsx
```

