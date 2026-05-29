// ============================================================
// Open-Meteo daily forecast (no API key required).
// Defaults to Nairobi; pass lat/lon to override.
// ============================================================

export interface DayWeather {
  date: string // YYYY-MM-DD
  tempMax: number
  tempMin: number
  code: number // WMO weather code
}

const NAIROBI = { lat: -1.286389, lon: 36.817223 }

/** WMO weather code → emoji glyph. */
export function weatherGlyph(code: number): string {
  if (code === 0) return '☀️'
  if (code <= 2) return '🌤️'
  if (code === 3) return '☁️'
  if (code >= 45 && code <= 48) return '🌫️'
  if (code >= 51 && code <= 67) return '🌧️'
  if (code >= 71 && code <= 77) return '🌨️'
  if (code >= 80 && code <= 82) return '🌦️'
  if (code >= 95) return '⛈️'
  return '🌡️'
}

export async function getForecast(
  lat = NAIROBI.lat,
  lon = NAIROBI.lon,
): Promise<DayWeather[]> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=16`

  const res = await fetch(url, { next: { revalidate: 3600 } })
  if (!res.ok) return []
  const data = await res.json()
  const d = data?.daily
  if (!d?.time) return []

  return d.time.map((date: string, i: number) => ({
    date,
    tempMax: Math.round(d.temperature_2m_max[i]),
    tempMin: Math.round(d.temperature_2m_min[i]),
    code: d.weather_code[i],
  }))
}
