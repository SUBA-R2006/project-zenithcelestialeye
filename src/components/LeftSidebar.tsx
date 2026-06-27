import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Navigation,
  MapPin,
  Clock,
  Star,
  Satellite,
  X,
  Globe2,
  History,
  Heart,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { majorCities } from '../data/constants';
import SatellitePanel from './SatellitePanel';
import ConstellationExplorer from './ConstellationExplorer';

export default function LeftSidebar({ onClose }: { onClose?: () => void }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'search' | 'satellites' | 'constellations'>('search');
  const [query, setQuery] = useState('');
  const { setCoordinates, setLoading, coordinates } = useAppStore();

  const filteredCities = query.length > 1
    ? majorCities.filter((city) =>
        city.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 10)
    : [];

  const handleSelectCity = (city: typeof majorCities[0]) => {
    setCoordinates({ lat: city.lat, lng: city.lng });
    setQuery('');
    onClose?.();
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
          onClose?.();
        },
        () => {
          setLoading(false);
        }
      );
    }
  };

  const tabs = [
    { id: 'search', icon: <Search className="w-4 h-4" />, label: 'Search' },
    { id: 'satellites', icon: <Satellite className="w-4 h-4" />, label: t('nav.satellites') },
    { id: 'constellations', icon: <Star className="w-4 h-4" />, label: t('nav.constellations') },
  ];

  return (
    <div className="sidebar-container">
      {/* Header */}
      <div className="panel-header">
        <div className="flex items-center gap-2">
          <Globe2 className="w-5 h-5 text-accent-400" />
          <span className="font-orbitron font-semibold text-sm">Zenith Control</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors lg:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-3 text-xs font-medium transition-all ${
              activeTab === tab.id
                ? 'text-accent-400 border-b-2 border-accent-400 bg-accent-500/10'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.icon}
            <span className="hidden xl:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          {activeTab === 'search' && (
            <motion.div
              key="search"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <div className="p-3 space-y-3">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t('search.placeholder')}
                    className="cosmic-input pl-10 pr-3 py-2.5 text-sm"
                  />
                </div>

                {/* Use My Location Button */}
                <button
                  onClick={handleUseMyLocation}
                  className="w-full flex items-center gap-2 px-3 py-2.5 bg-accent-500/20 hover:bg-accent-500/30 rounded-xl text-accent-400 text-sm transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  <span>{t('search.useMyLocation')}</span>
                </button>

                {/* Current Location Display */}
                {coordinates && (
                  <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg text-sm">
                    <MapPin className="w-4 h-4 text-red-400" />
                    <span className="text-white/80">
                      {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
                    </span>
                  </div>
                )}
              </div>

              {/* Search Results or Recent */}
              <div className="flex-1 overflow-y-auto scroll-container">
                {query.length > 1 && filteredCities.length > 0 ? (
                  <div className="p-3 pt-0 space-y-1">
                    <p className="text-xs text-white/40 mb-2">Search Results</p>
                    {filteredCities.map((city) => (
                      <button
                        key={city.name}
                        onClick={() => handleSelectCity(city)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/10 rounded-lg transition-colors text-left group"
                      >
                        <MapPin className="w-4 h-4 text-white/40 group-hover:text-accent-400" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{city.name}</p>
                          <p className="text-xs text-white/40">{city.country}</p>
                        </div>
                        <span className="text-xs text-white/30">
                          {city.lat.toFixed(1)}, {city.lng.toFixed(1)}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 pt-0 space-y-3">
                    {/* Recent Searches */}
                    <div>
                      <div className="flex items-center gap-2 text-xs text-white/40 mb-2">
                        <History className="w-3 h-3" />
                        <span>Recent Searches</span>
                      </div>
                      {['Tokyo', 'New York', 'London'].map((city) => (
                        <div
                          key={city}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-white/60 hover:bg-white/10 rounded-lg cursor-pointer"
                        >
                          <Clock className="w-3 h-3" />
                          {city}
                        </div>
                      ))}
                    </div>

                    {/* Favorites */}
                    <div>
                      <div className="flex items-center gap-2 text-xs text-white/40 mb-2">
                        <Heart className="w-3 h-3" />
                        <span>Favorite Locations</span>
                      </div>
                      {['Chennai, India', 'Paris, France'].map((loc) => (
                        <div
                          key={loc}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-white/60 hover:bg-white/10 rounded-lg cursor-pointer"
                        >
                          <Heart className="w-3 h-3 text-red-400/60" />
                          {loc}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'satellites' && (
            <motion.div
              key="satellites"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex-1 overflow-hidden"
            >
              <SatellitePanel />
            </motion.div>
          )}

          {activeTab === 'constellations' && (
            <motion.div
              key="constellations"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex-1 overflow-hidden"
            >
              <ConstellationExplorer />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
