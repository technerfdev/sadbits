import axios from "axios";
import { CloudIcon, Loader2 } from "lucide-react";
import type { JSX } from "react";
import { useEffect, useState } from "react";
import CloudflareAnalytics from "../CloudflareStats/CloudflareStats";

interface WeatherData {
  location: string;
  temperature: number;
  description: string;
  icon: string;
}

function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-background border border-border/40">
      <div className="text-4xl font-bold tabular-nums">
        {time.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
      </div>
      <div className="text-sm text-muted-foreground mt-1">
        {time.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
      </div>
    </div>
  );
}

function Weather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const position = await new Promise<GeolocationPosition>(
          (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          }
        );

        const { latitude, longitude } = position.coords;

        const response = await axios.get(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );

        const { current_weather } = response.data;

        const geocodeResponse = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );

        const location =
          geocodeResponse.data.address.city ||
          geocodeResponse.data.address.town ||
          geocodeResponse.data.address.village ||
          "Unknown";

        setWeather({
          location,
          temperature: Math.round(current_weather.temperature),
          description: getWeatherDescription(current_weather.weathercode),
          icon: getWeatherIcon(current_weather.weathercode),
        });
      } catch (err) {
        setError("Unable to fetch weather data");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const getWeatherDescription = (code: number): string => {
    const descriptions: Record<number, string> = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Foggy",
      48: "Foggy",
      51: "Light drizzle",
      61: "Light rain",
      63: "Moderate rain",
      65: "Heavy rain",
      71: "Light snow",
      73: "Moderate snow",
      75: "Heavy snow",
      95: "Thunderstorm",
    };
    return descriptions[code] || "Unknown";
  };

  const getWeatherIcon = (code: number): string => {
    if (code === 0 || code === 1) return "☀️";
    if (code === 2 || code === 3) return "⛅";
    if (code >= 51 && code <= 65) return "🌧️";
    if (code >= 71 && code <= 75) return "❄️";
    if (code === 95) return "⛈️";
    return "🌤️";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4 rounded-lg bg-background border border-border/40">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 p-4 rounded-lg bg-background border border-border/40">
        <CloudIcon className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">{error}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-4 rounded-lg bg-background border border-border/40">
      <div className="flex items-center justify-between">
        <span className="text-2xl">{weather?.icon}</span>
        <span className="text-3xl font-bold">{weather?.temperature}°C</span>
      </div>
      <div className="text-sm text-muted-foreground">
        {weather?.description}
      </div>
      <div className="text-xs text-muted-foreground">{weather?.location}</div>
    </div>
  );
}

export default function Home(): JSX.Element {
  return (
    <div className="grid h-[calc(100vh-6rem)] grid-cols-[auto_1fr] grid-rows-[auto_1fr] overflow-hidden [grid-template-areas:'header_header''sidebar_content']">
      <div className="[grid-area:header] col-span-2 border-b bg-background p-4">
        Header
      </div>
      <div className="[grid-area:sidebar] overflow-y-auto border-r bg-muted/30 p-4 space-y-4">
        <Clock />
        <Weather />
      </div>
      <div className="[grid-area:content] overflow-y-auto p-4">
        <CloudflareAnalytics />
      </div>
    </div>
  );
}
