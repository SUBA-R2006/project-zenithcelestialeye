import { useState, useEffect } from 'react';
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
  X,
  Newspaper,
  ExternalLink,
  Activity,
  Gauge,
  Star,
  Satellite,
  Camera,
  Share2,
  Globe2,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { spaceNews } from '../data/constants';
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

export default function RightPanel({ onClose }: { onClose?: () => void }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'info' | 'stats' | 'news'>('info');
  const { coordinates, locationInfo, setLocationInfo, satellites } = useAppStore();
  const [localTime, setLocalTime] = useState(new Date());
  const [issVelocity, setIssVelocity] = useState(7.66);

  useEffect(() => {
    const timer = setInterval(() => setLocalTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIssVelocity(7.6 + Math.random() * 0.1);
    }, 2000);
    return () => clearInterval(interval);
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

  const handleScreenshot = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `zenith-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  const handleShare = () => {
    const { coordinates: coords } = useAppStore.getState();
    if (coords) {
      const url = `${window.location.origin}?lat=${coords.lat}&lng=${coords.lng}`;
      navigator.clipboard.writeText(url);
    }
  };

  const visibleNow = satellites.filter((s) => s.visible).length;
  const brightest = satellites.reduce(
    (min, s) => (s.brightness || 10) < (min.brightness || 10) ? s : min,
    satellites[0]
  );
  const closest = satellites.reduce((min, s) => (s.alt < min.alt ? s : min), satellites[0]);

  const tabs = [
    { id: 'info', icon: <MapPin className="w-4 h-4" />, label: 'Location' },
    { id: 'stats', icon: <Activity className="w-4 h-4" />, label: 'Stats' },
    { id: 'news', icon: <Newspaper className="w-4 h-4" />, label: 'News' },
  ];

  const sourceColors: Record<string, string> = {
    nasa: 'bg-blue-500/20 text-blue-400',
    esa: 'bg-purple-500/20 text-purple-400',
    isro: 'bg-orange-500/20 text-orange-400',
    spacex: 'bg-cyan-500/20 text-cyan-400',
    discovery: 'bg-green-500/20 text-green-400',
  };

  return (
    <div className="sidebar-container">
      {/* Header */}
      <div className="panel-header">
        <div className="flex items-center gap-2">
          <Globe2 className="w-5 h-5 text-primary-400" />
          <span className="font-orbitron font-semibold text-sm">Mission Data</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleScreenshot}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            title={t('actions.screenshot')}
          >
            <Camera className="w-4 h-4" />
          </button>
          <button
            onClick={handleShare}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            title={t('actions.share')}
          >
            <Share2 className="w-4 h-4" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors xl:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-3 text-xs font-medium transition-all ${
              activeTab === tab.id
                ? 'text-primary-400 border-b-2 border-primary-400 bg-primary-500/10'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.icon}
            <span className="hidden xl:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scroll-container">
        <AnimatePresence mode="wait">
          {activeTab === 'info' && (
            <motion.div
              key="info"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 space-y-3"
            >
              {!coordinates || !locationInfo ? (
                <div className="text-center py-8 text-white/50">
                  <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">{t('location.noLocation')}</p>
                </div>
              ) : (
                <>
                  {/* Location Header */}
                  <div className="glass-panel p-3 bg-gradient-to-br from-primary-500/20 to-accent-500/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{locationInfo.city}</h3>
                        <p className="text-xs text-white/60">{locationInfo.country}</p>
                      </div>
                    </div>
                    <div className="mt-2 text-xs font-mono text-white/40">
                      {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="glass-panel p-3">
                      <div className="flex items-center gap-2 text-white/50 mb-1">
                        <Users className="w-3 h-3" />
                        <span className="text-xs">{t('location.population')}</span>
                      </div>
                      <p className="font-medium text-sm">{locationInfo.population?.toLocaleString()}</p>
                    </div>
                    <div className="glass-panel p-3">
                      <div className="flex items-center gap-2 text-white/50 mb-1">
                        <Clock className="w-3 h-3" />
                        <span className="text-xs">{t('location.timezone')}</span>
                      </div>
                      <p className="font-medium text-sm">{formatTime(localTime, locationInfo.timezone)}</p>
                    </div>
                    <div className="glass-panel p-3">
                      <div className="flex items-center gap-2 text-white/50 mb-1">
                        <Sun className="w-3 h-3 text-yellow-400" />
                        <span className="text-xs">{t('location.sunrise')}</span>
                      </div>
                      <p className="font-medium text-sm">{locationInfo.sunrise}</p>
                    </div>
                    <div className="glass-panel p-3">
                      <div className="flex items-center gap-2 text-white/50 mb-1">
                        <Moon className="w-3 h-3 text-blue-300" />
                        <span className="text-xs">{t('location.sunset')}</span>
                      </div>
                      <p className="font-medium text-sm">{locationInfo.sunset}</p>
                    </div>
                  </div>

                  {/* Weather */}
                  {locationInfo.weather && (
                    <div className="glass-panel p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Cloud className="w-5 h-5 text-accent-400" />
                          <div>
                            <p className="font-bold">{locationInfo.weather.temp}C</p>
                            <p className="text-xs text-white/60">{locationInfo.weather.condition}</p>
                          </div>
                        </div>
                        <div className="text-right text-xs text-white/50">
                          <div className="flex items-center gap-1">
                            <Droplets className="w-3 h-3" />
                            {locationInfo.weather.humidity}%
                          </div>
                          <div className="flex items-center gap-1">
                            <Wind className="w-3 h-3" />
                            {locationInfo.weather.windSpeed} km/h
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Elevation */}
                  <div className="glass-panel p-3">
                    <div className="flex items-center gap-2 text-white/50 mb-1">
                      <Mountain className="w-3 h-3" />
                      <span className="text-xs">{t('location.elevation')}</span>
                    </div>
                    <p className="font-medium">{locationInfo.elevation}m</p>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {activeTab === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 space-y-3"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div className="glass-panel p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                  <div className="flex items-center gap-1 mb-1 text-cyan-400">
                    <Satellite className="w-4 h-4" />
                  </div>
                  <div className="text-xl font-orbitron font-bold">{satellites.length}</div>
                  <div className="text-xs text-white/50">{t('stats.satellitesTracked')}</div>
                </div>
                <div className="glass-panel p-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20">
                  <div className="flex items-center gap-1 mb-1 text-green-400">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div className="text-xl font-orbitron font-bold">{visibleNow}</div>
                  <div className="text-xs text-white/50">{t('stats.visibleNow')}</div>
                </div>
              </div>

              {/* ISS Speedometer */}
              <div className="glass-panel p-4 bg-gradient-to-br from-primary-500/10 to-accent-500/10">
                <div className="flex items-center gap-2 mb-3">
                  <Gauge className="w-4 h-4 text-accent-400" />
                  <span className="text-xs text-white/60">ISS Speedometer</span>
                </div>
                <div className="relative h-16 flex items-center justify-center">
                  <svg viewBox="0 0 100 60" className="w-full h-full">
                    <path
                      d="M 10 55 A 40 40 0 0 1 90 55"
                      fill="none"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                    <motion.path
                      d="M 10 55 A 40 40 0 0 1 90 55"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: issVelocity / 10 }}
                      transition={{ duration: 0.5 }}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#22d3ee" />
                        <stop offset="100%" stopColor="#6366f1" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                      className="text-xl font-orbitron font-bold"
                      animate={{ opacity: [1, 0.7, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      {issVelocity.toFixed(2)}
                    </motion.span>
                    <span className="text-xs text-white/50">km/s</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-white/5 rounded-lg p-2.5">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm">{t('stats.brightest')}</span>
                  </div>
                  <span className="text-xs text-white/60">{brightest?.name}</span>
                </div>
                <div className="flex items-center justify-between bg-white/5 rounded-lg p-2.5">
                  <div className="flex items-center gap-2">
                    <Satellite className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm">{t('stats.closest')}</span>
                  </div>
                  <span className="text-xs text-white/60">{closest?.name}</span>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'news' && (
            <motion.div
              key="news"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 space-y-2"
            >
              {spaceNews.map((news) => (
                <a
                  key={news.id}
                  href={news.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block glass-panel p-3 hover:bg-white/10 transition-all group"
                >
                  <div className="flex items-start gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs ${sourceColors[news.category]}`}>
                      {news.source}
                    </span>
                  </div>
                  <h4 className="text-sm font-medium mt-2 leading-snug group-hover:text-accent-400 transition-colors line-clamp-2">
                    {news.title}
                  </h4>
                  <p className="text-xs text-white/50 mt-1 line-clamp-2">{news.summary}</p>
                  <div className="flex items-center justify-between mt-2 text-xs text-white/40">
                    <span>{news.publishedAt}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
