import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  Satellite,
  Star,
  MessageCircle,
  Newspaper,
  Languages,
  Monitor,
  X,
  Rocket,
  Database,
  Code,
  Layers,
  Compass,
} from 'lucide-react';

export default function AboutProjectModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
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
            className="glass-panel max-w-[600px] w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-500 to-primary-500 flex items-center justify-center">
                    <Rocket className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="font-orbitron text-xl font-bold">About Project</h2>
                    <p className="text-xs text-white/50">Project Zenith: The Celestial Eye</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5">
                {/* Description */}
                <div className="glass-panel p-4 bg-gradient-to-br from-primary-500/10 to-accent-500/10">
                  <p className="text-sm text-white/80 leading-relaxed">
                    A real-time cosmic radar platform that visualizes satellites, the ISS, planets, constellations, and celestial objects above any selected location using live astronomy APIs and an interactive 3D globe.
                  </p>
                </div>

                {/* Technologies Used */}
                <div>
                  <div className="flex items-center gap-2 text-white/60 mb-3">
                    <Code className="w-4 h-4" />
                    <span className="text-sm font-medium">Technologies Used</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'React.js', 'TypeScript', 'Tailwind CSS', 'Three.js',
                      'React Three Fiber', 'Framer Motion', 'Zustand', 'i18next',
                    ].map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 bg-white/5 rounded-lg text-xs text-white/70"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Data Sources */}
                <div>
                  <div className="flex items-center gap-2 text-white/60 mb-3">
                    <Database className="w-4 h-4" />
                    <span className="text-sm font-medium">Data Sources</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: 'NASA Horizons API', type: 'Celestial Data' },
                      { name: 'OpenNotify API', type: 'ISS Position' },
                      { name: 'CelesTrak API', type: 'Satellite TLE' },
                    ].map((source) => (
                      <div
                        key={source.name}
                        className="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
                      >
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                        <div>
                          <p className="text-xs font-medium">{source.name}</p>
                          <p className="text-[10px] text-white/40">{source.type}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Features */}
                <div>
                  <div className="flex items-center gap-2 text-white/60 mb-3">
                    <Layers className="w-4 h-4" />
                    <span className="text-sm font-medium">Key Features</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { icon: <Globe className="w-3 h-3" />, name: 'Interactive 3D Globe' },
                      { icon: <Satellite className="w-3 h-3" />, name: 'Live ISS Tracking' },
                      { icon: <Satellite className="w-3 h-3" />, name: 'Satellite Monitoring' },
                      { icon: <Star className="w-3 h-3" />, name: 'Constellation Explorer' },
                      { icon: <Compass className="w-3 h-3" />, name: 'Time Travel Mode' },
                      { icon: <MessageCircle className="w-3 h-3" />, name: 'Zenith AI Assistant' },
                      { icon: <Newspaper className="w-3 h-3" />, name: 'Space News' },
                      { icon: <Languages className="w-3 h-3" />, name: 'Multilingual Support' },
                      { icon: <Monitor className="w-3 h-3" />, name: 'Responsive Design' },
                    ].map((feature) => (
                      <div
                        key={feature.name}
                        className="flex items-center gap-2 p-2 bg-white/5 rounded-lg"
                      >
                        <div className="text-accent-400">{feature.icon}</div>
                        <span className="text-xs">{feature.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-white/10" />

                {/* Version & Credits */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-lg text-xs font-mono">
                      v1.0
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/40">Developed For</p>
                    <p className="text-sm font-medium text-accent-400">AstralWeb Innovate Hackathon 2026</p>
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
