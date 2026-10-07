import { useEffect, useMemo, useState } from 'react';
import './App.css';

type Timeline = {
  endLabel: string;
  label: string;
  value: number;
};

type WeatherState = {
  apparentTemperature: number;
  humidity: number;
  precipitation: number;
  temperature: number;
  time: string;
  weatherCode: number;
  windGust: number;
  windSpeed: number;
};

type RiverLocation = {
  id: string;
  name: string;
  gaugeName: string;
  latitude: number;
  longitude: number;
  site: string;
};

type RiverGauge = {
  flowCfs?: number;
  levelFt?: number;
  temperatureF?: number;
  time?: string;
};

type RiverCondition = {
  gauge?: RiverGauge;
  loading: boolean;
  suggestions?: string;
  suggestionError?: string;
  suggestionLoading?: boolean;
  weather?: WeatherState;
  error?: string;
};

const timelineStart = new Date('2026-04-26T00:00:00');     // 04/26/2026
const timelineEndJune = new Date('2026-06-04T23:59:59');   // 06/04/2026
const timelineEndJuly = new Date('2026-07-06T23:59:59');   // 07/06/2026

const getTimelineProgressJune = () => {
  const today = new Date();
  const total = timelineEndJune.getTime() - timelineStart.getTime();
  const elapsed = today.getTime() - timelineStart.getTime();

  return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
};

const getTimelineProgressJuly = () => {
  const today = new Date();
  const total = timelineEndJuly.getTime() - timelineStart.getTime();
  const elapsed = today.getTime() - timelineStart.getTime();

  return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
};

const weatherDescriptions: Record<number, string> = {
  0: 'Clear',
  1: 'Mostly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Rime fog',
  51: 'Light drizzle',
  53: 'Drizzle',
  55: 'Heavy drizzle',
  61: 'Light rain',
  63: 'Rain',
  65: 'Heavy rain',
  71: 'Light snow',
  73: 'Snow',
  75: 'Heavy snow',
  80: 'Light showers',
  81: 'Showers',
  82: 'Heavy showers',
  95: 'Thunderstorm',
  96: 'Storm with hail',
  99: 'Heavy storm with hail',
};

const riverLocations: RiverLocation[] = [
  {
    id: 'willamette-corvallis',
    name: 'Willamette near Corvallis',
    gaugeName: 'Willamette River at Corvallis',
    latitude: 44.5518,
    longitude: -123.2519,
    site: '14171600',
  },
  {
    id: 'mckenzie-hayden',
    name: 'McKenzie near Hayden Bridge',
    gaugeName: 'McKenzie River above Hayden Bridge',
    latitude: 44.0712365,
    longitude: -122.9645273,
    site: '14164900',
  },
  {
    id: 'mckenzie-leaburg',
    name: 'McKenzie near Leaburg',
    gaugeName: 'McKenzie River below Leaburg Dam',
    latitude: 44.1239,
    longitude: -122.6264,
    site: '14163150',
  },
];

const initialRiverConditions = riverLocations.reduce<Record<string, RiverCondition>>(
  (conditions, location) => ({
    ...conditions,
    [location.id]: { loading: true, suggestionLoading: true },
  }),
  {}
);

const getWeatherUrl = (location: RiverLocation) =>
  `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,wind_gusts_10m&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=America%2FLos_Angeles`;

const getGaugeUrl = (site: string) =>
  `https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${site}&parameterCd=00010,00060,00065&siteStatus=all`;

const parseGauge = (data: {
  value?: {
    timeSeries?: Array<{
      variable?: { variableCode?: Array<{ value: string }> };
      values?: Array<{ value?: Array<{ dateTime: string; value: string }> }>;
    }>;
  };
}): RiverGauge => {
  const gauge: RiverGauge = {};

  data.value?.timeSeries?.forEach((series) => {
    const code = series.variable?.variableCode?.[0]?.value;
    const reading = series.values?.[0]?.value?.[0];

    if (!code || !reading) {
      return;
    }

    const value = Number(reading.value);

    if (Number.isNaN(value)) {
      return;
    }

    if (code === '00010') {
      gauge.temperatureF = Math.round(((value * 9) / 5 + 32) * 10) / 10;
    }

    if (code === '00060') {
      gauge.flowCfs = Math.round(value);
    }

    if (code === '00065') {
      gauge.levelFt = Math.round(value * 100) / 100;
    }

    gauge.time = reading.dateTime;
  });

  return gauge;
};

export default function Home() {
  const juneProgress = useMemo(() => getTimelineProgressJune(), []);
  const julyProgress = useMemo(() => getTimelineProgressJuly(), []);
  const timelines = useMemo<Timeline[]>(() => [
    { endLabel: 'Jun', label: 'May->June Timeline', value: juneProgress },
    { endLabel: 'July', label: 'May->July Timeline', value: julyProgress },
  ], [juneProgress, julyProgress]);
  const [riverConditions, setRiverConditions] = useState<Record<string, RiverCondition>>(
    initialRiverConditions
  );

  useEffect(() => {
    let isMounted = true;

    Promise.all(
      riverLocations.map(async (location) => {
        try {
          const [weatherResponse, gaugeResponse] = await Promise.all([
            fetch(getWeatherUrl(location)),
            fetch(getGaugeUrl(location.site)),
          ]);

          if (!weatherResponse.ok || !gaugeResponse.ok) {
            throw new Error('River condition request failed');
          }

          const weatherData = await weatherResponse.json();
          const gaugeData = await gaugeResponse.json();
          const gauge = parseGauge(gaugeData);
          const weather = {
            apparentTemperature: weatherData.current.apparent_temperature,
            humidity: weatherData.current.relative_humidity_2m,
            precipitation: weatherData.current.precipitation,
            temperature: weatherData.current.temperature_2m,
            time: weatherData.current.time,
            weatherCode: weatherData.current.weather_code,
            windGust: weatherData.current.wind_gusts_10m,
            windSpeed: weatherData.current.wind_speed_10m,
          };

          let suggestions = '';
          let suggestionError = '';

          try {
            const suggestionResponse = await fetch('/api/suggest-flies', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                gauge,
                river: location.name,
                weather,
              }),
            });

            const suggestionData: { error?: string; suggestions?: string } =
              await suggestionResponse.json();

            if (!suggestionResponse.ok) {
              suggestionError = suggestionData.error ?? 'Suggestions unavailable';
              throw new Error(suggestionError);
            }

            suggestions = suggestionData.suggestions ?? '';
          } catch {
            suggestionError ||= 'Suggestions unavailable';
          }

          return {
            id: location.id,
            condition: {
              gauge,
              loading: false,
              suggestionError,
              suggestionLoading: false,
              suggestions,
              weather,
            } satisfies RiverCondition,
          };
        } catch {
          return {
            id: location.id,
            condition: {
              loading: false,
              suggestionLoading: false,
              error: 'Conditions unavailable',
            } satisfies RiverCondition,
          };
        }
      })
    ).then((results) => {
      if (!isMounted) {
        return;
      }

      setRiverConditions((current) => ({
        ...current,
        ...results.reduce<Record<string, RiverCondition>>(
          (conditions, result) => ({
            ...conditions,
            [result.id]: result.condition,
          }),
          {}
        ),
      }));
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="dashboard-shell">
      <section className="dashboard-hero" aria-labelledby="dashboard-title">
        <div>
          <p className="eyebrow">Personal command center</p>
          <h1 id="dashboard-title">Munga Dashboard</h1>
        </div>
      </section>

      <section className="dashboard-grid" aria-label="Dashboard widgets">
        <div className="panel timeline-panel">
          <div className="panel-header">
            <div>
              <p className="section-kicker">Planning</p>
              <h2>Timeline Progress</h2>
            </div>
          </div>

          <div className="timeline-list">
            {timelines.map((timeline, index) => (
              <article className="timeline-card" key={index}>
                <div className="timeline-top">
                  <h3>{timeline.label}</h3>
                  <strong>{timeline.value}%</strong>
                </div>
                <div className="timeline-dates">
                  <span>Apr</span>
                  <span>{timeline.endLabel}</span>
                </div>
                <div className="progress-track" aria-hidden="true">
                  <span style={{ width: `${timeline.value}%` }} />
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="panel river-panel">
          <div className="panel-header">
            <div>
              <p className="section-kicker">Conditions</p>
              <h2>River Status</h2>
            </div>
            <span className="river-badge">Live</span>
          </div>

          <div className="river-location-list">
            {riverLocations.map((location) => {
              const condition = riverConditions[location.id];
              const weather = condition?.weather;
              const gauge = condition?.gauge;

              return (
                <article className="river-location-card" key={location.id}>
                  <div className="river-location-head">
                    <div>
                      <h3>{location.name}</h3>
                      <p>{location.gaugeName}</p>
                    </div>
                    {weather && <b>{Math.round(weather.temperature)}F</b>}
                  </div>

                  {condition?.loading && <p className="weather-message">Loading conditions...</p>}
                  {condition?.error && <p className="weather-message">{condition.error}</p>}

                  {weather && (
                    <>
                      <strong className="condition-line">
                        {weatherDescriptions[weather.weatherCode] ?? 'Current conditions'}
                      </strong>
                      <div className="weather-details">
                        <span>Feels {Math.round(weather.apparentTemperature)}F</span>
                        <span>Wind {Math.round(weather.windSpeed)} mph</span>
                        <span>Rain {weather.precipitation.toFixed(2)} in</span>
                        <span>Humidity {weather.humidity}%</span>
                      </div>
                    </>
                  )}

                  <div className="river-metrics">
                    <div>
                      <span>Water Temp</span>
                      <strong>{gauge?.temperatureF ? `${gauge.temperatureF}F` : 'No reading'}</strong>
                    </div>
                    <div>
                      <span>Level</span>
                      <strong>{gauge?.levelFt ? `${gauge.levelFt} ft` : 'No reading'}</strong>
                    </div>
                    <div>
                      <span>Flow</span>
                      <strong>{gauge?.flowCfs ? `${gauge.flowCfs.toLocaleString()} cfs` : 'No reading'}</strong>
                    </div>
                  </div>

                  {condition?.suggestionLoading && (
                    <p className="weather-message">Loading fly suggestions...</p>
                  )}

                  {condition?.suggestionError && (
                    <p className="weather-message">{condition.suggestionError}</p>
                  )}

                  {condition?.suggestions && (
                    <div className="ai-suggestions">
                      <span>ChatGPT Suggestions</span>
                      <p>{condition.suggestions}</p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
