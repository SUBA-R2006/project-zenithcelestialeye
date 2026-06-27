import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  MapPin,
  Navigation,
  X,
  Globe,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { majorCities } from '../data/constants';

export default function SearchPanel() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [showCoords, setShowCoords] = useState(false);
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { setCoordinates, setLoading, setError, coordinates } = useAppStore();

  const filteredCities = query.length > 1
    ? majorCities.filter((city) =>
        city.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelectCity = (city: typeof majorCities[0]) => {
    setCoordinates({ lat: city.lat, lng: city.lng });
    setQuery(city.name);
    setIsOpen(false);
    setShowCoords(false);
  };

  const handleCoordsSubmit = () => {
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    if (isNaN(latNum) || isNaN(lngNum) || latNum < -90 || latNum > 90 || lngNum < -180 || lngNum > 180) {
      setError('Invalid coordinates');
      return;
    }

    setCoordinates({ lat: latNum, lng: lngNum });
    setShowCoords(false);
    setLat('');
    setLng('');
  };

  const handleUseMyLocation = () => {
    if ('geolocation' in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLoading(false);
          setQuery('My Location');
        },
        () => {
          setError('Unable to get location. Please enable GPS.');
          setLoading(false);
        }
      );
    }
  };

  return (
    <motion.div
      ref={searchRef}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-24 left-4 right-4 md:left-auto md:right-auto md:left-1/2 md:-translate-x-1/2 z-40"
    >
      <div className="glass-panel p-2 max-w-lg mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={t('search.placeholder')}
            className="cosmic-input pl-12 pr-20"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {query && (
              <button
                onClick={() => {
                  setQuery('');
                  setIsOpen(false);
                }}
                className="p-1 hover:bg-white/10 rounded"
              >
                <X className="w-4 h-4 text-white/50" />
              </button>
            )}
            <button
              onClick={handleUseMyLocation}
              className="flex items-center gap-1 px-2 py-1 bg-accent-500/20 hover:bg-accent-500/30 rounded-lg text-accent-400 text-sm transition-colors"
              title={t('search.useMyLocation')}
            >
              <Navigation className="w-4 h-4" />
              <span className="hidden sm:inline">{t('search.useMyLocation')}</span>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (filteredCities.length > 0 || showCoords) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 space-y-1"
            >
              {filteredCities.map((city) => (
                <button
                  key={city.name}
                  onClick={() => handleSelectCity(city)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 rounded-lg transition-colors text-left group"
                >
                  <MapPin className="w-4 h-4 text-accent-400 group-hover:text-accent-300" />
                  <div className="flex-1">
                    <p className="font-medium">{city.name}</p>
                    <p className="text-xs text-white/50">{city.country}</p>
                  </div>
                  <p className="text-xs text-white/40">
                    {city.lat.toFixed(2)}, {city.lng.toFixed(2)}
                  </p>
                </button>
              ))}

              <button
                onClick={() => setShowCoords(!showCoords)}
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-lg transition-colors text-white/70 text-sm"
              >
                <Globe className="w-4 h-4" />
                {t('search.enterCoords')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showCoords && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 p-4 bg-white/5 rounded-lg space-y-3"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-white/60 mb-1 block">{t('search.latitude')}</label>
                  <input
                    type="number"
                    step="0.0001"
                    min="-90"
                    max="90"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    placeholder="e.g., 13.0827"
                    className="cosmic-input text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/60 mb-1 block">{t('search.longitude')}</label>
                  <input
                    type="number"
                    step="0.0001"
                    min="-180"
                    max="180"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    placeholder="e.g., 80.2707"
                    className="cosmic-input text-sm"
                  />
                </div>
              </div>
              <button
                onClick={handleCoordsSubmit}
                disabled={!lat || !lng}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('search.go')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {coordinates && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-center text-sm text-white/60"
        >
          <span className="text-accent-400">{coordinates.lat.toFixed(4)}</span>
          <span className="mx-2">,</span>
          <span className="text-accent-400">{coordinates.lng.toFixed(4)}</span>
        </motion.div>
      )}
    </motion.div>
  );
}
