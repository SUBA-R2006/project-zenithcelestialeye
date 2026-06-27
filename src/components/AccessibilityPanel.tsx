import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  Type,
  Activity,
  Keyboard,
  Volume2,
  X,
  RotateCcw,
  Plus,
  Minus,
  BookOpen,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export default function AccessibilityPanel({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const { accessibility, setAccessibility, resetAccessibility } = useAppStore();

  const increaseFontSize = () => {
    const sizes: Array<'normal' | 'large' | 'xlarge'> = ['normal', 'large', 'xlarge'];
    const currentIndex = sizes.indexOf(accessibility.fontSize);
    if (currentIndex < sizes.length - 1) {
      setAccessibility({ fontSize: sizes[currentIndex + 1] });
    }
  };

  const decreaseFontSize = () => {
    const sizes: Array<'normal' | 'large' | 'xlarge'> = ['normal', 'large', 'xlarge'];
    const currentIndex = sizes.indexOf(accessibility.fontSize);
    if (currentIndex > 0) {
      setAccessibility({ fontSize: sizes[currentIndex - 1] });
    }
  };

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
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/30 to-emerald-500/30 flex items-center justify-center">
                    <Eye className="w-5 h-5 text-green-400" />
                  </div>
                  <h2 className="font-orbitron text-lg font-bold">{t('accessibility.title')}</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Text Size Controls */}
                <div>
                  <div className="flex items-center gap-2 text-white/60 mb-3">
                    <Type className="w-4 h-4" />
                    <span className="text-sm font-medium">{t('accessibility.textSize')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={decreaseFontSize}
                      disabled={accessibility.fontSize === 'normal'}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-all"
                    >
                      <Minus className="w-4 h-4" />
                      <span className="text-sm">{t('accessibility.decrease')}</span>
                    </button>
                    <div className="px-4 py-3 bg-white/10 rounded-xl min-w-[80px] text-center">
                      <span className="text-sm capitalize">{accessibility.fontSize}</span>
                    </div>
                    <button
                      onClick={increaseFontSize}
                      disabled={accessibility.fontSize === 'xlarge'}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="text-sm">{t('accessibility.increase')}</span>
                    </button>
                  </div>
                </div>

                <div className="h-px bg-white/10" />

                {/* Toggle Options */}
                <div className="space-y-2">
                  <ToggleItem
                    icon={<Eye className="w-4 h-4" />}
                    label={t('accessibility.highContrast')}
                    checked={accessibility.highContrast}
                    onChange={() => setAccessibility({ highContrast: !accessibility.highContrast })}
                  />

                  <ToggleItem
                    icon={<Activity className="w-4 h-4" />}
                    label={t('accessibility.reducedMotion')}
                    checked={accessibility.reducedMotion}
                    onChange={() => setAccessibility({ reducedMotion: !accessibility.reducedMotion })}
                  />

                  <ToggleItem
                    icon={<BookOpen className="w-4 h-4" />}
                    label={t('accessibility.dyslexiaFont')}
                    checked={accessibility.dyslexiaFont}
                    onChange={() => setAccessibility({ dyslexiaFont: !accessibility.dyslexiaFont })}
                  />

                  <ToggleItem
                    icon={<Keyboard className="w-4 h-4" />}
                    label={t('accessibility.keyboardNav')}
                    checked={accessibility.keyboardNavigation}
                    onChange={() => setAccessibility({ keyboardNavigation: !accessibility.keyboardNavigation })}
                  />

                  <ToggleItem
                    icon={<Volume2 className="w-4 h-4" />}
                    label={t('accessibility.screenReader')}
                    checked={accessibility.screenReaderMode}
                    onChange={() => setAccessibility({ screenReaderMode: !accessibility.screenReaderMode })}
                  />
                </div>

                <div className="h-px bg-white/10" />

                {/* Reset Button */}
                <button
                  onClick={resetAccessibility}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  {t('accessibility.reset')}
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
          checked ? 'bg-green-500' : 'bg-white/20'
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
