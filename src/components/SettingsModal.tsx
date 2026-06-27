import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  X,
  Sun,
  Moon,
  Monitor,
  Orbit,
  Tag,
  Sparkles,
  Globe,
  RotateCcw,
  Zap,
  Clock,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function SettingsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const { settings, setSettings, resetSettings } = useAppStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 z-[1300] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-panel max-w-md w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="font-orbitron text-lg font-bold">{t('settings.title')}</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5">
                {/* Theme Selection */}
                <div>
                  <div className="flex items-center gap-2 text-white/60 mb-3">
                    <Monitor className="w-4 h-4" />
                    <span className="text-sm font-medium">{t('settings.theme')}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setSettings({ theme: 'dark' })}
                      className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all ${
                        settings.theme === 'dark'
                          ? 'bg-primary-500 text-white'
                          : 'bg-white/5 hover:bg-white/10 text-white/70'
                      }`}
                    >
                      <Moon className="w-4 h-4" />
                      Dark
                    </button>
                    <button
                      onClick={() => setSettings({ theme: 'light' })}
                      className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all ${
                        settings.theme === 'light'
                          ? 'bg-primary-500 text-white'
                          : 'bg-white/5 hover:bg-white/10 text-white/70'
                      }`}
                    >
                      <Sun className="w-4 h-4" />
                      Light
                    </button>
                    <button
                      onClick={() => setSettings({ theme: 'auto' })}
                      className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-all ${
                        settings.theme === 'auto'
                          ? 'bg-primary-500 text-white'
                          : 'bg-white/5 hover:bg-white/10 text-white/70'
                      }`}
                    >
                      <Monitor className="w-4 h-4" />
                      Auto
                    </button>
                  </div>
                </div>

                <div className="h-px bg-white/10" />

                {/* Globe Quality */}
                <div>
                  <div className="flex items-center gap-2 text-white/60 mb-3">
                    <Globe className="w-4 h-4" />
                    <span className="text-sm font-medium">{t('settings.globeQuality')}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {['low', 'medium', 'high'].map((quality) => (
                      <button
                        key={quality}
                        onClick={() => setSettings({ globeQuality: quality as 'low' | 'medium' | 'high' })}
                        className={`px-3 py-2.5 rounded-lg text-sm capitalize transition-all ${
                          settings.globeQuality === quality
                            ? 'bg-primary-500 text-white'
                            : 'bg-white/5 hover:bg-white/10 text-white/70'
                        }`}
                      >
                        {quality}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Animation Speed */}
                <div>
                  <div className="flex items-center gap-2 text-white/60 mb-3">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm font-medium">{t('settings.animationSpeed')}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {['slow', 'normal', 'fast'].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => setSettings({ animationSpeed: speed as 'slow' | 'normal' | 'fast' })}
                        className={`px-3 py-2.5 rounded-lg text-sm capitalize transition-all ${
                          settings.animationSpeed === speed
                            ? 'bg-primary-500 text-white'
                            : 'bg-white/5 hover:bg-white/10 text-white/70'
                        }`}
                      >
                        {speed}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Auto Refresh Interval */}
                <div>
                  <div className="flex items-center gap-2 text-white/60 mb-3">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">{t('settings.autoRefresh')}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[10, 30, 60, 120].map((interval) => (
                      <button
                        key={interval}
                        onClick={() => setSettings({ autoRefreshInterval: interval })}
                        className={`px-3 py-2.5 rounded-lg text-sm transition-all ${
                          settings.autoRefreshInterval === interval
                            ? 'bg-primary-500 text-white'
                            : 'bg-white/5 hover:bg-white/10 text-white/70'
                        }`}
                      >
                        {interval}s
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-white/10" />

                {/* Toggle Options */}
                <div className="space-y-2">
                  <ToggleItem
                    icon={<Orbit className="w-4 h-4" />}
                    label={t('settings.orbitTrails')}
                    checked={settings.showOrbitTrails}
                    onChange={() => setSettings({ showOrbitTrails: !settings.showOrbitTrails })}
                  />

                  <ToggleItem
                    icon={<Tag className="w-4 h-4" />}
                    label={t('settings.liveLabels')}
                    checked={settings.showLiveLabels}
                    onChange={() => setSettings({ showLiveLabels: !settings.showLiveLabels })}
                  />

                  <ToggleItem
                    icon={<Sparkles className="w-4 h-4" />}
                    label={t('settings.particleBackground')}
                    checked={settings.showParticleBackground}
                    onChange={() => setSettings({ showParticleBackground: !settings.showParticleBackground })}
                  />
                </div>

                <div className="h-px bg-white/10" />

                {/* Reset Button */}
                <button
                  onClick={resetSettings}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  {t('settings.resetDefaults')}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ToggleItem({
  icon,
  label,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all"
    >
      <div className="flex items-center gap-3">
        <div className="text-white/60">{icon}</div>
        <span className="text-sm">{label}</span>
      </div>
      <div
        className={`w-10 h-6 rounded-full p-0.5 transition-all ${
          checked ? 'bg-primary-500' : 'bg-white/20'
        }`}
      >
        <div
          className={`w-5 h-5 rounded-full bg-white transition-transform ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </div>
    </button>
  );
}
