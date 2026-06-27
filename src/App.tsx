import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import EarthGlobe from './components/EarthGlobe';
import LeftSidebar from './components/LeftSidebar';
import RightPanel from './components/RightPanel';
import AIChat from './components/AIChat';
import MobileNav from './components/MobileNav';
import { useAppStore } from './store/useAppStore';

function App() {
  const { accessibility, language, isChatOpen } = useAppStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [aiPanelWidth, setAiPanelWidth] = useState(400);
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.lang = language;

    // High contrast mode
    if (accessibility.highContrast) {
      document.body.classList.add('high-contrast-mode');
    } else {
      document.body.classList.remove('high-contrast-mode');
    }

    // Reduced motion
    if (accessibility.reducedMotion) {
      document.body.classList.add('reduced-motion');
    } else {
      document.body.classList.remove('reduced-motion');
    }

    // Font size
    if (accessibility.fontSize === 'large') {
      document.body.classList.add('font-size-large');
      document.body.classList.remove('font-size-xlarge');
    } else if (accessibility.fontSize === 'xlarge') {
      document.body.classList.add('font-size-xlarge');
      document.body.classList.remove('font-size-large');
    } else {
      document.body.classList.remove('font-size-large', 'font-size-xlarge');
    }

    // Dyslexia-friendly font
    if (accessibility.dyslexiaFont) {
      document.body.classList.add('dyslexia-font');
    } else {
      document.body.classList.remove('dyslexia-font');
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

  // Handle AI panel resize
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = window.innerWidth - e.clientX;
      const clampedWidth = Math.min(Math.max(newWidth, 320), 500);
      setAiPanelWidth(clampedWidth);
    },
    [isResizing]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleRightPanel = () => setIsRightPanelOpen(!isRightPanelOpen);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      {/* Fixed Navbar - Always visible */}
      <Navbar
        onMenuClick={toggleSidebar}
        onInfoClick={toggleRightPanel}
      />

      {/* Main Content - Below navbar */}
      <div className="main-content">
        {/* Overlay for mobile sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="sidebar-overlay open lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Dashboard Grid */}
        <div className="dashboard-grid flex-1">
          {/* Left Sidebar - Hidden on mobile */}
          <div className="left-sidebar hidden lg:block">
            <LeftSidebar />
          </div>

          {/* Mobile Left Sidebar Drawer */}
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25 }}
                className="left-sidebar open lg:hidden"
              >
                <LeftSidebar onClose={() => setIsSidebarOpen(false)} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Globe Container - Takes remaining space */}
          <div className="globe-container">
            <EarthGlobe />
          </div>

          {/* Right Panel - Hidden on smaller screens */}
          <div className="right-panel hidden xl:block">
            <RightPanel onClose={() => {}} />
          </div>

          {/* Mobile Right Panel Drawer */}
          <AnimatePresence>
            {isRightPanelOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="sidebar-overlay open xl:hidden"
                  onClick={() => setIsRightPanelOpen(false)}
                />
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25 }}
                  className="ai-panel open xl:hidden"
                  style={{ width: '85vw', maxWidth: '400px' }}
                >
                  <RightPanel onClose={() => setIsRightPanelOpen(false)} />
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* AI Chat Panel - Fixed right side, below navbar */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="ai-panel open"
              style={{ width: `${aiPanelWidth}px` }}
            >
              {/* Resize handle */}
              <div
                ref={resizeRef}
                className="ai-panel-resize hidden md:block"
                onMouseDown={handleMouseDown}
              />
              <AIChat />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        onSidebarClick={toggleSidebar}
        onRightPanelClick={toggleRightPanel}
      />
    </div>
  );
}

export default App;
