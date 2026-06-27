import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronRight, BookOpen, Calendar, Eye, Sparkles, X } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { constellations } from '../data/constants';
import type { Constellation } from '../types';

export default function ConstellationExplorer() {
  const { selectedConstellation, selectConstellation } = useAppStore();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-3 py-2 border-b border-white/10">
        <div className="flex items-center gap-2 text-xs text-white/50">
          <Star className="w-4 h-4 text-yellow-400" />
          <span>{constellations.length} constellations</span>
        </div>
      </div>

      {/* Constellation List */}
      <div className="flex-1 overflow-y-auto scroll-container p-2 space-y-1.5">
        {constellations.map((constellation) => (
          <ConstellationCard
            key={constellation.id}
            constellation={constellation}
            isSelected={selectedConstellation?.id === constellation.id}
            onSelect={() =>
              selectConstellation(
                selectedConstellation?.id === constellation.id ? null : constellation
              )
            }
          />
        ))}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedConstellation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => selectConstellation(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-panel max-w-md w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <ConstellationDetail
                constellation={selectedConstellation}
                onClose={() => selectConstellation(null)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ConstellationCard({
  constellation,
  isSelected,
  onSelect,
}: {
  constellation: Constellation;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const visibilityColor =
    constellation.visibility >= 90
      ? 'bg-green-500'
      : constellation.visibility >= 75
      ? 'bg-yellow-500'
      : 'bg-orange-500';

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-2.5 rounded-lg transition-all text-sm ${
        isSelected
          ? 'bg-yellow-500/20 border border-yellow-500/40'
          : 'bg-white/5 hover:bg-white/10 border border-transparent'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className={`w-2 h-2 rounded-full ${visibilityColor}`} />
          <span className="font-medium truncate text-xs">{constellation.name}</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-white/40">
          <Star className="w-3 h-3" />
          <span>{constellation.stars.length}</span>
          <ChevronRight className="w-3 h-3 ml-1" />
        </div>
      </div>
    </button>
  );
}

function ConstellationDetail({
  constellation,
  onClose,
}: {
  constellation: Constellation;
  onClose: () => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/40 to-orange-500/40 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <h2 className="text-xl font-orbitron font-bold">{constellation.name}</h2>
            <p className="text-sm text-white/50">{constellation.latinName}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="glass-panel p-3">
          <div className="flex items-center gap-2 text-white/50 mb-2">
            <Eye className="w-4 h-4" />
            <span className="text-xs">{t('constellations.visibility')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                style={{ width: `${constellation.visibility}%` }}
              />
            </div>
            <span className="font-semibold text-sm">{constellation.visibility}%</span>
          </div>
        </div>

        <div className="glass-panel p-3">
          <div className="flex items-center gap-2 text-white/50 mb-2">
            <Calendar className="w-4 h-4" />
            <span className="text-xs">{t('constellations.bestSeason')}</span>
          </div>
          <p className="font-medium text-sm">{constellation.bestSeason}</p>
        </div>
      </div>

      {/* Mythology */}
      <div className="glass-panel p-4 mb-4">
        <div className="flex items-center gap-2 text-white/50 mb-2">
          <BookOpen className="w-4 h-4" />
          <span className="text-xs">{t('constellations.mythology')}</span>
        </div>
        <p className="text-sm text-white/80 leading-relaxed">{constellation.mythology}</p>
      </div>

      {/* Stars */}
      <div>
        <div className="flex items-center gap-2 text-white/50 mb-2">
          <Star className="w-4 h-4" />
          <span className="text-xs">{t('constellations.stars')}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {constellation.stars.slice(0, 6).map((star) => (
            <div
              key={star.id}
              className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2"
            >
              <span className="text-xs">{star.name}</span>
              <span className="text-xs text-yellow-400">{star.magnitude.toFixed(1)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
