import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import EarthGlobe from './components/EarthGlobe';
import LeftSidebar from './components/LeftSidebar';
import RightPanel from './components/RightPanel';
import AIChat from './components/AIChat';
import MobileNav from './components/MobileNav';
import { useAppStore } from './store/useAppStore';

function App() {
  const { t } = useTranslation();
  const { accessibility, language } = useAppStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);

  useEffect(() => {
    document.documentElement.lang = language;
    if (accessibility.highContrast) {
      document.body.classList.add('high-contrast-mode');
    } else {
      document.body.classList.remove('high-contrast-mode');
    }
    if (accessibility.reducedMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }
    if (accessibility.fontSize === 'large') {
      document.body.classList.add('font-size-large');
      document.body.classList.remove('font-size-xlarge');
    } else if (accessibility.fontSize === 'xlarge') {
      document.body.classList.add('font-size-xlarge');
      document.body.classList.remove('font-size-large');
    } else {
      document.body.classList.remove('font-size-large', 'font-size-xlarge');
    }
  }, [accessibility, language]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lat = params.get('lat');
    const lng = params.get('lng');
    if (lat && lng) {
      const coordinates = { lat: parseFloat(lat), lng: parseFloat(lng) };
      useAppStore.getState().setCoordinates(coordinates);
    }
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleRightPanel = () => setIsRightPanelOpen(!isRightPanelOpen);

  return (
    <div className="dashboard-grid">
      <Navbar
        onMenuClick={toggleSidebar}
        onInfoClick={toggleRightPanel}
      />

      <div className="dashboard-main relative overflow-hidden">
        {/* Desktop Left Sidebar */}
        <div className="hidden lg:block">
          <LeftSidebar />
        </div>

        {/* Mobile/Tablet Drawer Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="drawer-overlay open lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25 }}
                className="drawer lg:hidden"
              >
                <LeftSidebar onClose={() => setIsSidebarOpen(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Globe Container - Takes remaining space */}
        <div className="globe-container relative bg-cosmic-darker">
          <EarthGlobe />
        </div>

        {/* Desktop Right Panel */}
        <div className="right-panel hidden xl:block">
          <RightPanel />
        </div>

        {/* Mobile Right Drawer */}
        <AnimatePresence>
          {isRightPanelOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="drawer-overlay open xl:hidden"
                onClick={() => setIsRightPanelOpen(false)}
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25 }}
                className="drawer drawer-right xl:hidden"
              >
                <RightPanel onClose={() => setIsRightPanelOpen(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="hidden md:flex items-center justify-center text-xs text-white/40 border-t border-white/10 bg-cosmic-dark/50">
        <span className="font-orbitron">{t('tagline')}</span>
        <span className="mx-2">|</span>
        <span>Project Zenith - The Celestial Eye</span>
      </footer>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        onSidebarClick={toggleSidebar}
        onRightPanelClick={toggleRightPanel}
      />

      {/* AI Chat Overlay */}
      <AIChat />
    </div>
  );
}

export default App;
