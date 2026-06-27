export interface Coordinates {
  lat: number;
  lng: number;
}

export interface LocationInfo {
  city: string;
  country: string;
  region: string;
  population?: number;
  timezone: string;
  sunrise?: string;
  sunset?: string;
  weather?: WeatherData;
  elevation?: number;
}

export interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export interface Satellite {
  id: string;
  name: string;
  noradId: string;
  type: SatelliteType;
  lat: number;
  lng: number;
  alt: number;
  velocity: number;
  visible: boolean;
  brightness?: number;
  orbitType: OrbitType;
  launchDate?: string;
  country?: string;
  inclination?: number;
}

export type SatelliteType =
  | 'communication'
  | 'navigation'
  | 'weather'
  | 'scientific'
  | 'military'
  | 'earth_observation'
  | 'debris'
  | 'unknown';

export type OrbitType =
  | 'LEO'
  | 'MEO'
  | 'GEO'
  | 'HEO'
  | 'ISS';

export interface Constellation {
  id: string;
  name: string;
  latinName: string;
  mythology: string;
  origin: string;
  bestSeason: string;
  visibility: number;
  stars: Star[];
  lines: [number, number][];
  ra: number;
  dec: number;
}

export interface Star {
  id: string;
  name: string;
  ra: number;
  dec: number;
  magnitude: number;
  constellation: string;
}

export interface CelestialObject {
  id: string;
  name: string;
  type: 'planet' | 'star' | 'satellite' | 'asteroid' | 'comet';
  ra: number;
  dec: number;
  magnitude: number;
  distance: number;
  visible: boolean;
}

export interface SpaceNews {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  category: 'nasa' | 'esa' | 'isro' | 'spacex' | 'discovery';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface GeographicLabel {
  id: string;
  name: string;
  type: 'continent' | 'country' | 'ocean' | 'state' | 'city' | 'capital' | 'landmark';
  lat: number;
  lng: number;
  population?: number;
  country?: string;
  zoomLevel: number[];
}

export interface AccessibilitySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  fontSize: 'normal' | 'large' | 'xlarge';
  screenReaderMode: boolean;
}

export interface AppState {
  coordinates: Coordinates | null;
  locationInfo: LocationInfo | null;
  satellites: Satellite[];
  selectedSatellite: Satellite | null;
  constellations: Constellation[];
  selectedConstellation: Constellation | null;
  celestialObjects: CelestialObject[];
  news: SpaceNews[];
  chatMessages: ChatMessage[];
  isChatOpen: boolean;
  isSearchOpen: boolean;
  accessibility: AccessibilitySettings;
  language: string;
  zoomLevel: number;
  isLoading: boolean;
  error: string | null;
  dayNightMode: boolean;
  showOrbitTrails: boolean;
  showCloudLayer: boolean;
}
