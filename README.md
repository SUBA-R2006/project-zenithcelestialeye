# Project Zenith: The Celestial Eye

## Project Overview

Project Zenith is an immersive, real-time cosmic radar platform that allows users to select any geographic coordinate on Earth and instantly visualize all celestial objects currently passing through that location's zenith. This NASA-grade astronomy dashboard combines scientific accuracy with modern UI/UX design, making space accessible to both enthusiasts and beginners.

## Problem Statement

Understanding what's above us in the night sky has always been challenging for the average person. While professional astronomers have access to sophisticated tools, the general public lacks an accessible, visually engaging platform to:

- Track satellites and space stations
- Learn about constellations and their mythology
- Understand the relationship between Earth locations and celestial objects
- Get real-time space news and updates

Project Zenith solves this by providing an intuitive, educational, and visually stunning platform that brings the cosmos to your fingertips.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React + TypeScript)            │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   EarthGlobe  │  │  SearchPanel │  │  AI Chat     │           │
│  │   (Three.js)  │  │  (Locations) │  │  (Zenith AI) │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │  Satellite   │  │Constellation │  │  News Feed   │           │
│  │   Panel      │  │  Explorer    │  │              │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
├─────────────────────────────────────────────────────────────────┤
│                    State Management (Zustand)                    │
│              i18n (Multi-language Support)                       │
├─────────────────────────────────────────────────────────────────┤
│                        External APIs                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │  Geolocation │  │   Satellite  │  │    News      │           │
│  │     API      │  │    Data      │  │   Sources    │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
└─────────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend Framework
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server

### 3D Visualization
- **Three.js** - 3D graphics library
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Useful helpers for R3F

### Styling
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Glassmorphism design** - Modern glass-style UI elements

### State Management
- **Zustand** - Lightweight state management
- **Persist middleware** - Local storage persistence

### Internationalization
- **i18next** - Internationalization framework
- **react-i18next** - React bindings
- **i18next-browser-languagedetector** - Auto language detection

### Icons
- **Lucide React** - Beautiful & consistent icons

## Features

### Core Features
1. **Interactive 3D Earth Globe** - Click to select any location
2. **Smart Geographic Labels** - Continents, countries, cities, landmarks
3. **Satellite Tracking** - Real-time positions and information
4. **Constellation Explorer** - Mythology, visibility, and stars
5. **AI Astronomy Assistant** - "Zenith AI" chatbot
6. **Multi-language Support** - 12 languages
7. **Accessibility** - Screen reader, high contrast, font sizes

### Premium Features
- Dynamic day/night Earth rendering
- Orbit trails and satellite speedometer
- Space weather dashboard
- Screenshot generator
- Shareable coordinate links
- Real-time statistics panel
- Space news feed

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd project-zenith

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

No external API keys are required for basic functionality. The application uses:
- Browser's built-in Geolocation API for user location
- Simulated data for satellites and weather

For production with real satellite data, you may add:

```env
VITE_N2YO_API_KEY=your_api_key_here
VITE_OPENWEATHER_API_KEY=your_api_key_here
```

## Deployment Guide

### Build for Production

```bash
npm run build
```

The build output is in the `dist/` folder.

### Deploy Options

1. **Vercel** (Recommended)
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Netlify**
   - Drag and drop the `dist/` folder

3. **Static Hosting**
   - Upload `dist/` contents to any static host

## Project Structure

```
src/
├── components/
│   ├── AIChat.tsx              # Zenith AI assistant
│   ├── AccessibilityPanel.tsx  # Accessibility options
│   ├── ConstellationExplorer.tsx
│   ├── CosmicBackground.tsx     # Animated stars/effects
│   ├── EarthGlobe.tsx           # 3D globe visualization
│   ├── LocationPanel.tsx        # Location info card
│   ├── Navbar.tsx               # Navigation bar
│   ├── SatellitePanel.tsx       # Satellite list
│   ├── SearchPanel.tsx          # Location search
│   ├── SettingsModal.tsx        # User preferences
│   ├── SpaceNewsFeed.tsx        # News aggregator
│   └── StatsPanel.tsx           # Statistics & speedometer
├── data/
│   └── constants.ts             # Static data
├── i18n/
│   └── index.ts                 # Translations (12 languages)
├── store/
│   └── useAppStore.ts          # Zustand store
├── types/
│   └── index.ts                # TypeScript types
├── App.tsx                     # Main component
├── main.tsx                    # Entry point
└── index.css                   # Global styles
```

## Accessibility Features

The application supports:
- **High Contrast Mode** - For visually impaired users
- **Reduced Motion** - For motion sensitivity
- **Adjustable Font Size** - Normal, Large, Extra Large
- **Screen Reader Support** - ARIA labels and semantic HTML
- **Keyboard Navigation** - Full keyboard accessibility

## Supported Languages

- English (en)
- Tamil (ta)
- Hindi (hi)
- Telugu (te)
- Malayalam (ml)
- Kannada (kn)
- Japanese (ja)
- Chinese (zh)
- Spanish (es)
- French (fr)
- German (de)
- Arabic (ar)

## Future Scope

1. **Real-time Satellite Data** - Integration with NORAD/N2YO API
2. **Augmented Reality Mode** - AR sky view on mobile
3. **User Accounts** - Save favorite locations and settings
4. **Push Notifications** - ISS/satellite passes alerts
5. **Educational Mode** - Interactive astronomy lessons
6. **Community Features** - Share observations, photo gallery
7. **WebSocket Updates** - Real-time satellite positions

## Screenshots

The application features:
- Stunning 3D Earth visualization with cosmic background
- Glassmorphism-styled UI panels
- Animated shooting stars and nebula effects
- Real-time satellite tracking dashboard
- Interactive constellation explorer with mythology
- AI chatbot for astronomy questions

## License

MIT License - Feel free to use and modify for your own projects.

---

**Project Zenith** - Bringing the cosmos to everyone's fingertips.
