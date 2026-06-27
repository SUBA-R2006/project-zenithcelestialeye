import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  X,
  Sun,
  Moon,
  Orbit,
  Cloud,
  Languages,
  Globe,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'ta', name: 'Tamil' },
  { code: 'hi', name: 'Hindi' },
  { code: 'te', name: 'Telugu' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'kn', name: 'Kannada' },
  { code: 'ja', name: 'Japanese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'ar', name: 'Arabic' },
];

export default function SettingsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { t, i18n } = useTranslation();
  const {
    dayNightMode,
    toggleDayNight,
    showOrbitTrails,
    toggleOrbitTrails,
    showCloudLayer,
    toggleCloudLayer,
    setLanguage,
  } = useAppStore();

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    setLanguage(code);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-panel max-w-md w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="font-orbitron text-xl font-bold">{t('settings.title')}</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-white/60 mb-3">
                    <Languages className="w-4 h-4" />
                    <span className="text-sm font-medium">{t('settings.language')}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`px-3 py-2 rounded-lg text-sm transition-all ${
                          i18n.language === lang.code
                            ? 'bg-primary-500 text-white'
                            : 'bg-white/5 hover:bg-white/10 text-white/70'
                        }`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-white/10" />

                <div>
                  <div className="flex items-center gap-2 text-white/60 mb-4">
                    <Globe className="w-4 h-4" />
                    <span className="text-sm font-medium">{t('settings.appearance')}</span>
                  </div>

                  <div className="space-y-3">
                    <ToggleItem
                      icon={dayNightMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                      label={t('settings.dayNight')}
                      checked={dayNightMode}
                      onChange={toggleDayNight}
                    />

                    <ToggleItem
                      icon={<Orbit className="w-4 h-4" />}
                      label={t('settings.orbitTrails')}
                      checked={showOrbitTrails}
                      onChange={toggleOrbitTrails}
                    />

                    <ToggleItem
                      icon={<Cloud className="w-4 h-4" />}
                      label={t('settings.cloudLayer')}
                      checked={showCloudLayer}
                      onChange={toggleCloudLayer}
                    />
                  </div>
                </div>
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
        <span>{label}</span>
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
