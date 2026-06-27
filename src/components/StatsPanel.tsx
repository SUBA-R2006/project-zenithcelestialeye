import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Activity,
  Gauge,
  Star,
  Satellite,
  Globe2,
  Camera,
  Share2,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function StatsPanel() {
  const { t } = useTranslation();
  const { satellites } = useAppStore();
  const [issVelocity, setIssVelocity] = useState(7.66);

  useEffect(() => {
    const interval = setInterval(() => {
      setIssVelocity(7.6 + Math.random() * 0.1);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const visibleNow = satellites.filter((s) => s.visible).length;
  const brightest = satellites.reduce(
    (min, s) => (s.brightness || 10) < (min.brightness || 10) ? s : min,
    satellites[0]
  );
  const closest = satellites.reduce((min, s) => (s.alt < min.alt ? s : min), satellites[0]);

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
    const { coordinates } = useAppStore.getState();
    if (coordinates) {
      const url = `${window.location.origin}?lat=${coordinates.lat}&lng=${coordinates.lng}`;
      navigator.clipboard.writeText(url);
    }
  };

  return (
    <div className="glass-panel p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-orbitron font-semibold text-sm text-white/80">
          {t('stats.satellitesTracked')}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleScreenshot}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title={t('actions.screenshot')}
          >
            <Camera className="w-4 h-4" />
          </button>
          <button
            onClick={handleShare}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title={t('actions.share')}
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={<Activity className="w-4 h-4" />}
          value={satellites.length.toString()}
          label={t('stats.satellitesTracked')}
          color="text-cyan-400"
          bg="bg-cyan-500/20"
        />
        <StatCard
          icon={<Satellite className="w-4 h-4" />}
          value={visibleNow.toString()}
          label={t('stats.visibleNow')}
          color="text-green-400"
          bg="bg-green-500/20"
        />
      </div>

      <div className="glass-panel p-4 bg-gradient-to-br from-primary-500/10 to-accent-500/10">
        <div className="flex items-center gap-2 mb-3">
          <Gauge className="w-4 h-4 text-accent-400" />
          <span className="text-xs text-white/60">ISS Speedometer</span>
        </div>
        <div className="relative h-24 flex items-center justify-center">
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
              className="text-2xl font-orbitron font-bold"
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              {issVelocity.toFixed(2)}
            </motion.span>
            <span className="text-xs text-white/50">km/s</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-xs text-white/50 uppercase tracking-wider">{t('stats.brightest')}</div>
        <div className="flex items-center justify-between bg-white/5 rounded-lg p-2">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-sm">{brightest?.name || 'ISS'}</span>
          </div>
          <span className="text-xs text-white/60">{brightest?.brightness || -3.8} mag</span>
        </div>

        <div className="flex items-center justify-between bg-white/5 rounded-lg p-2">
          <div className="flex items-center gap-2">
            <Satellite className="w-4 h-4 text-cyan-400" />
            <span className="text-sm">{t('stats.closest')}: {closest?.name}</span>
          </div>
          <span className="text-xs text-white/60">{closest?.alt} km</span>
        </div>

        <div className="flex items-center justify-between bg-white/5 rounded-lg p-2">
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-orange-400" />
            <span className="text-sm">{t('stats.highestPlanet')}</span>
          </div>
          <span className="text-xs text-white/60">Jupiter</span>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
  color,
  bg,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
  bg: string;
}) {
  return (
    <div className={`${bg} rounded-xl p-3`}>
      <div className={`flex items-center gap-1 mb-1 ${color}`}>{icon}</div>
      <div className="text-xl font-orbitron font-bold">{value}</div>
      <div className="text-xs text-white/50">{label}</div>
    </div>
  );
}
