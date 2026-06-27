import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  Type,
  Activity,
  Volume2,
  X,
  Check,
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
  const { accessibility, setAccessibility } = useAppStore();

  const fontSizes = [
    { id: 'normal', label: t('accessibility.normal') },
    { id: 'large', label: t('accessibility.large') },
    { id: 'xlarge', label: t('accessibility.xlarge') },
  ];

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
            className="glass-panel max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/30 to-emerald-500/30 flex items-center justify-center">
                    <Eye className="w-5 h-5 text-green-400" />
                  </div>
                  <h2 className="font-orbitron text-xl font-bold">{t('accessibility.title')}</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
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
                  icon={<Volume2 className="w-4 h-4" />}
                  label={t('accessibility.screenReader')}
                  checked={accessibility.screenReaderMode}
                  onChange={() => setAccessibility({ screenReaderMode: !accessibility.screenReaderMode })}
                />

                <div className="h-px bg-white/10" />

                <div>
                  <div className="flex items-center gap-2 text-white/60 mb-3">
                    <Type className="w-4 h-4" />
                    <span className="text-sm font-medium">{t('accessibility.fontSize')}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {fontSizes.map((size) => (
                      <button
                        key={size.id}
                        onClick={() => setAccessibility({ fontSize: size.id as 'normal' | 'large' | 'xlarge' })}
                        className={`px-4 py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2 ${
                          accessibility.fontSize === size.id
                            ? 'bg-primary-500 text-white'
                            : 'bg-white/5 hover:bg-white/10 text-white/70'
                        }`}
                      >
                        {accessibility.fontSize === size.id && <Check className="w-4 h-4" />}
                        {size.label}
                      </button>
                    ))}
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
