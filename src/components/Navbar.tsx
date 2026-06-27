import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe,
  Menu,
  Languages,
  Eye,
  MessageCircle,
  Settings,
  Info,
  Sun,
  Moon,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import SettingsModal from './SettingsModal';
import AccessibilityPanel from './AccessibilityPanel';
import AboutProjectModal from './AboutProjectModal';

const languages = [
  { code: 'en', name: 'English', native: 'EN' },
  { code: 'ta', name: 'Tamil', native: 'TA' },
  { code: 'hi', name: 'Hindi', native: 'HI' },
  { code: 'te', name: 'Telugu', native: 'TE' },
  { code: 'ml', name: 'Malayalam', native: 'ML' },
  { code: 'kn', name: 'Kannada', native: 'KN' },
  { code: 'ja', name: 'Japanese', native: 'JP' },
  { code: 'zh', name: 'Chinese', native: 'ZH' },
  { code: 'es', name: 'Spanish', native: 'ES' },
  { code: 'fr', name: 'French', native: 'FR' },
  { code: 'de', name: 'German', native: 'DE' },
  { code: 'ar', name: 'Arabic', native: 'AR' },
];

interface NavbarProps {
  onMenuClick: () => void;
  onInfoClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { t, i18n } = useTranslation();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const langRef = useRef<HTMLDivElement>(null);
  const { isChatOpen, toggleChat } = useAppStore();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLangOpen(false);
        setIsSettingsOpen(false);
        setIsAccessibilityOpen(false);
        setIsAboutOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    useAppStore.getState().setLanguage(code);
    setIsLangOpen(false);
  };

  return (
    <>
      <nav className="navbar-fixed px-4 flex items-center justify-between">
        {/* Left - Logo and Menu */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Globe className="w-7 h-7 text-accent-400" />
              <div className="absolute inset-0 bg-accent-400/30 blur-lg rounded-full" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-orbitron font-bold text-sm tracking-wider">
                {t('title')}
              </h1>
              <p className="text-[10px] text-white/50">{t('subtitle')}</p>
            </div>
          </div>
        </div>

        {/* Center - Navigation (Desktop) */}
        <div className="hidden lg:flex items-center gap-1">
          <NavItem icon={<Globe className="w-4 h-4" />} label="Globe" active />
          <NavItem
            icon={<Info className="w-4 h-4" />}
            label={t('nav.about')}
            onClick={() => setIsAboutOpen(true)}
          />
        </div>

        {/* Right - Actions (Always Visible) */}
        <div className="flex items-center gap-1">
          {/* Language Selector - Always visible */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Change language"
            >
              <Languages className="w-4 h-4" />
              <span className="text-xs text-white/80">
                {languages.find((l) => l.code === i18n.language)?.native || 'EN'}
              </span>
            </button>

            {/* Language Dropdown - z-index: 1200 */}
            <AnimatePresence>
              {isLangOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="dropdown-menu w-44 bg-cosmic-dark/98 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden shadow-2xl"
                  style={{ zIndex: 1200 }}
                >
                  <div className="max-h-60 overflow-y-auto scroll-container">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`w-full px-3 py-2 text-left hover:bg-white/10 transition-colors flex items-center justify-between ${
                          i18n.language === lang.code
                            ? 'bg-accent-500/20 text-accent-400'
                            : ''
                        }`}
                      >
                        <span className="text-sm">{lang.name}</span>
                        <span className="text-xs text-white/40">{lang.native}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Toggle - Always visible */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-yellow-400" />
            ) : (
              <Moon className="w-4 h-4 text-blue-300" />
            )}
          </button>

          {/* Accessibility - Always visible */}
          <button
            onClick={() => setIsAccessibilityOpen(true)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Accessibility options"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Settings - Always visible */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* About - Visible on mobile */}
          <button
            onClick={() => setIsAboutOpen(true)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors lg:hidden"
            aria-label="About"
          >
            <Info className="w-4 h-4" />
          </button>

          {/* Zenith AI Button - Always visible */}
          <button
            onClick={toggleChat}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-sm font-medium ${
              isChatOpen
                ? 'bg-primary-500 text-white'
                : 'bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Zenith AI</span>
          </button>
        </div>
      </nav>

      {/* Modals - z-index: 1300 */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <AccessibilityPanel isOpen={isAccessibilityOpen} onClose={() => setIsAccessibilityOpen(false)} />
      <AboutProjectModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </>
  );
}

function NavItem({
  icon,
  label,
  active = false,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
        active
          ? 'bg-white/10 text-white'
          : 'text-white/60 hover:text-white hover:bg-white/5'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
