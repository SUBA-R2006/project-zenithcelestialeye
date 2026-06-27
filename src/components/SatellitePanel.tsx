import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  Filter,
  Activity,
  Gauge,
  Orbit,
  Ruler,
  Search,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { satelliteTypes } from '../data/constants';
import type { Satellite, SatelliteType } from '../types';

export default function SatellitePanel() {
  const { t } = useTranslation();
  const { satellites, selectedSatellite, selectSatellite } = useAppStore();
  const [filter, setFilter] = useState<SatelliteType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'altitude' | 'velocity' | 'brightness'>('altitude');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSatellites = satellites
    .filter((sat) => filter === 'all' || sat.type === filter)
    .filter((sat) => searchQuery.length < 2 || sat.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'altitude') return b.alt - a.alt;
      if (sortBy === 'velocity') return b.velocity - a.velocity;
      return (a.brightness || 10) - (b.brightness || 10);
    });

  const visibleCount = filteredSatellites.filter((s) => s.visible).length;

  const typeColors: Record<string, string> = {
    communication: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    navigation: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    weather: 'bg-green-500/20 text-green-400 border-green-500/30',
    scientific: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    military: 'bg-red-500/20 text-red-400 border-red-500/30',
    earth_observation: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-3 py-2 border-b border-white/10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-white/80">
              {visibleCount} {t('satellites.visible')}
            </span>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-1.5 rounded-lg transition-colors ${
              showFilters ? 'bg-primary-500/30 text-primary-400' : 'hover:bg-white/10'
            }`}
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-2 text-xs text-white/50">
          <span>{filteredSatellites.length} total</span>
        </div>

        {/* Search */}
        <div className="relative mt-2">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search satellites..."
            className="cosmic-input pl-8 py-2 text-xs"
          />
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-2 space-y-2"
            >
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-2 py-1 rounded text-xs ${
                    filter === 'all' ? 'bg-primary-500 text-white' : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  All
                </button>
                {satelliteTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setFilter(type.id as SatelliteType)}
                    className={`px-2 py-1 rounded text-xs ${
                      filter === type.id ? 'bg-primary-500 text-white' : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {type.name}
                  </button>
                ))}
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="cosmic-input text-xs py-1.5"
              >
                <option value="altitude">Altitude</option>
                <option value="velocity">Velocity</option>
                <option value="brightness">Brightness</option>
              </select>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Satellite List */}
      <div className="flex-1 overflow-y-auto scroll-container p-2 space-y-1.5">
        <AnimatePresence>
          {filteredSatellites.map((sat) => (
            <SatelliteCard
              key={sat.id}
              satellite={sat}
              isSelected={selectedSatellite?.id === sat.id}
              onSelect={() => selectSatellite(selectedSatellite?.id === sat.id ? null : sat)}
              typeColors={typeColors}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function SatelliteCard({
  satellite,
  isSelected,
  onSelect,
  typeColors,
}: {
  satellite: Satellite;
  isSelected: boolean;
  onSelect: () => void;
  typeColors: Record<string, string>;
}) {
  const { t } = useTranslation();

  return (
    <motion.button
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onClick={onSelect}
      className={`w-full text-left p-2 rounded-lg transition-all text-sm ${
        isSelected
          ? 'bg-primary-500/20 border border-primary-500/40'
          : 'bg-white/5 hover:bg-white/10 border border-transparent'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div
            className={`w-2 h-2 rounded-full ${
              satellite.visible ? 'bg-green-400 animate-pulse' : 'bg-white/30'
            }`}
          />
          <span className="font-medium truncate text-xs">{satellite.name}</span>
        </div>
        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${typeColors[satellite.type]}`}>
          {satellite.type.slice(0, 3).toUpperCase()}
        </span>
      </div>

      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="grid grid-cols-2 gap-1.5 mt-2 pt-2 border-t border-white/10 text-xs overflow-hidden"
          >
            <div className="flex items-center gap-1 text-white/60">
              <Ruler className="w-3 h-3" />
              <span>{satellite.alt.toLocaleString()} km</span>
            </div>
            <div className="flex items-center gap-1 text-white/60">
              <Gauge className="w-3 h-3" />
              <span>{satellite.velocity} km/s</span>
            </div>
            <div className="flex items-center gap-1 text-white/60">
              <Orbit className="w-3 h-3" />
              <span>{t(`satellites.orbits.${satellite.orbitType}`)}</span>
            </div>
            {satellite.brightness && (
              <div className="flex items-center gap-1 text-white/60">
                <Activity className="w-3 h-3" />
                <span>{satellite.brightness} mag</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
