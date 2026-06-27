import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Users,
  Clock,
  Sun,
  Moon,
  Cloud,
  Mountain,
  Droplets,
  Wind,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import type { LocationInfo, WeatherData } from '../types';
import { majorCities } from '../data/constants';

function simulateWeather(lat: number): WeatherData {
  const baseTemp = 30 - Math.abs(lat) * 0.5;
  return {
    temp: Math.round(baseTemp + (Math.random() - 0.5) * 10),
    condition: ['Clear', 'Partly Cloudy', 'Cloudy', 'Light Rain'][Math.floor(Math.random() * 4)],
    humidity: Math.round(40 + Math.random() * 40),
    windSpeed: Math.round(5 + Math.random() * 20),
    icon: 'clear',
  };
}

function formatTime(date: Date, timezone?: string): string {
  try {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: timezone,
    });
  } catch {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
}

export default function LocationPanel() {
  const { t } = useTranslation();
  const { coordinates, locationInfo, setLocationInfo } = useAppStore();
  const [localTime, setLocalTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setLocalTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (coordinates) {
      const nearestCity = majorCities.reduce((nearest, city) => {
        const distCurrent = Math.sqrt(
          Math.pow(city.lat - coordinates.lat, 2) + Math.pow(city.lng - coordinates.lng, 2)
        );
        const distNearest = Math.sqrt(
          Math.pow(nearest.lat - coordinates.lat, 2) + Math.pow(nearest.lng - coordinates.lng, 2)
        );
        return distCurrent < distNearest ? city : nearest;
      });

      const weather = simulateWeather(coordinates.lat);

      const now = new Date();
      const sunrise = new Date(now);
      sunrise.setHours(6 + Math.round(Math.random() * 2), Math.round(Math.random() * 60));
      const sunset = new Date(now);
      sunset.setHours(18 + Math.round(Math.random() * 2), Math.round(Math.random() * 60));

      const info: LocationInfo = {
        city: nearestCity.name,
        country: nearestCity.country,
        region: nearestCity.country,
        population: Math.round(100000 + Math.random() * 10000000),
        timezone: nearestCity.timezone,
        sunrise: formatTime(sunrise, nearestCity.timezone),
        sunset: formatTime(sunset, nearestCity.timezone),
        weather,
        elevation: Math.round(Math.random() * 500),
      };

      setLocationInfo(info);
    }
  }, [coordinates, setLocationInfo]);

  if (!coordinates || !locationInfo) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        className="fixed top-24 right-4 w-80 z-30 hidden md:block"
      >
        <div className="glass-panel p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{locationInfo.city}</h3>
                <p className="text-sm text-white/60">{locationInfo.country}</p>
              </div>
            </div>
          </div>

          <div className="text-xs text-white/40 font-mono">
            {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
          </div>

          <div className="h-px bg-white/10" />

          <div className="grid grid-cols-2 gap-3">
            <InfoItem
              icon={<Users className="w-4 h-4" />}
              label={t('location.population')}
              value={locationInfo.population?.toLocaleString() || 'N/A'}
            />
            <InfoItem
              icon={<Clock className="w-4 h-4" />}
              label={t('location.timezone')}
              value={formatTime(localTime, locationInfo.timezone)}
            />
            <InfoItem
              icon={<Sun className="w-4 h-4 text-yellow-400" />}
              label={t('location.sunrise')}
              value={locationInfo.sunrise || 'N/A'}
            />
            <InfoItem
              icon={<Moon className="w-4 h-4 text-blue-300" />}
              label={t('location.sunset')}
              value={locationInfo.sunset || 'N/A'}
            />
            <InfoItem
              icon={<Mountain className="w-4 h-4" />}
              label={t('location.elevation')}
              value={`${locationInfo.elevation || 0}m`}
            />
          </div>

          {locationInfo.weather && (
            <div className="glass-panel p-3 -mx-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                  <Cloud className="w-5 h-5 text-accent-400" />
                </div>
                <div>
                  <p className="font-semibold text-xl">{locationInfo.weather.temp}C</p>
                  <p className="text-sm text-white/60">{locationInfo.weather.condition}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1 text-white/60">
                  <Droplets className="w-3 h-3" />
                  <span>{locationInfo.weather.humidity}%</span>
                </div>
                <div className="flex items-center gap-1 text-white/60">
                  <Wind className="w-3 h-3" />
                  <span>{locationInfo.weather.windSpeed} km/h</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="text-white/50">{icon}</div>
      <div>
        <p className="text-xs text-white/40">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}
