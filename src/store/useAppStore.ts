import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  AppState,
  Coordinates,
  LocationInfo,
  Satellite,
  Constellation,
  CelestialObject,
  SpaceNews,
  ChatMessage,
  AccessibilitySettings,
  AppSettings,
} from '../types';

const initialAccessibility: AccessibilitySettings = {
  highContrast: false,
  reducedMotion: false,
  fontSize: 'normal',
  screenReaderMode: false,
  dyslexiaFont: false,
  keyboardNavigation: false,
};

const initialSettings: AppSettings = {
  theme: 'dark',
  globeQuality: 'high',
  animationSpeed: 'normal',
  autoRefreshInterval: 30,
  showOrbitTrails: true,
  showLiveLabels: true,
  showParticleBackground: true,
};

interface AppStore extends AppState {
  setCoordinates: (coords: Coordinates) => void;
  setLocationInfo: (info: LocationInfo | null) => void;
  setSatellites: (satellites: Satellite[]) => void;
  selectSatellite: (satellite: Satellite | null) => void;
  setConstellations: (constellations: Constellation[]) => void;
  selectConstellation: (constellation: Constellation | null) => void;
  setCelestialObjects: (objects: CelestialObject[]) => void;
  setNews: (news: SpaceNews[]) => void;
  addChatMessage: (message: ChatMessage) => void;
  clearChat: () => void;
  toggleChat: () => void;
  toggleSearch: () => void;
  setAccessibility: (settings: Partial<AccessibilitySettings>) => void;
  setSettings: (settings: Partial<AppSettings>) => void;
  resetAccessibility: () => void;
  resetSettings: () => void;
  setLanguage: (lang: string) => void;
  setZoomLevel: (level: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  toggleDayNight: () => void;
  toggleOrbitTrails: () => void;
  toggleCloudLayer: () => void;
  reset: () => void;
}

const initialState: AppState = {
  coordinates: null,
  locationInfo: null,
  satellites: [],
  selectedSatellite: null,
  constellations: [],
  selectedConstellation: null,
  celestialObjects: [],
  news: [],
  chatMessages: [],
  isChatOpen: false,
  isSearchOpen: false,
  accessibility: initialAccessibility,
  settings: initialSettings,
  language: 'en',
  zoomLevel: 1,
  isLoading: false,
  error: null,
  dayNightMode: true,
  showOrbitTrails: true,
  showCloudLayer: true,
};

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      ...initialState,

      setCoordinates: (coords) => set({ coordinates: coords }),
      setLocationInfo: (info) => set({ locationInfo: info }),
      setSatellites: (satellites) => set({ satellites }),
      selectSatellite: (satellite) => set({ selectedSatellite: satellite }),
      setConstellations: (constellations) => set({ constellations }),
      selectConstellation: (constellation) => set({ selectedConstellation: constellation }),
      setCelestialObjects: (objects) => set({ celestialObjects: objects }),
      setNews: (news) => set({ news }),
      addChatMessage: (message) =>
        set((state) => ({ chatMessages: [...state.chatMessages, message] })),
      clearChat: () => set({ chatMessages: [] }),
      toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
      toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
      setAccessibility: (settings) =>
        set((state) => ({ accessibility: { ...state.accessibility, ...settings } })),
      setSettings: (settings) =>
        set((state) => ({ settings: { ...state.settings, ...settings } })),
      resetAccessibility: () => set({ accessibility: initialAccessibility }),
      resetSettings: () => set({ settings: initialSettings }),
      setLanguage: (lang) => set({ language: lang }),
      setZoomLevel: (level) => set({ zoomLevel: level }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      toggleDayNight: () => set((state) => ({ dayNightMode: !state.dayNightMode })),
      toggleOrbitTrails: () => set((state) => ({ showOrbitTrails: !state.showOrbitTrails })),
      toggleCloudLayer: () => set((state) => ({ showCloudLayer: !state.showCloudLayer })),
      reset: () => set(initialState),
    }),
    {
      name: 'zenith-storage',
      partialize: (state) => ({
        language: state.language,
        accessibility: state.accessibility,
        settings: state.settings,
        dayNightMode: state.dayNightMode,
        showOrbitTrails: state.showOrbitTrails,
        showCloudLayer: state.showCloudLayer,
      }),
    }
  )
);
