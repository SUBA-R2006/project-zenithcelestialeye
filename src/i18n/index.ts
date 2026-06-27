import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      title: 'Project Zenith',
      subtitle: 'The Celestial Eye',
      tagline: 'Real-time Cosmic Radar Platform',
      nav: {
        home: 'Home',
        dashboard: 'Dashboard',
        satellites: 'Satellites',
        constellations: 'Constellations',
        news: 'Space News',
        settings: 'Settings',
        about: 'About',
      },
      search: {
        placeholder: 'Search locations...',
        useMyLocation: 'Use My Location',
        enterCoords: 'Enter Coordinates',
        latitude: 'Latitude',
        longitude: 'Longitude',
        go: 'Go',
      },
      location: {
        city: 'City',
        country: 'Country',
        region: 'Region',
        population: 'Population',
        timezone: 'Timezone',
        sunrise: 'Sunrise',
        sunset: 'Sunset',
        weather: 'Weather',
        elevation: 'Elevation',
        noLocation: 'Click on the globe to select a location',
      },
      satellites: {
        title: 'Satellites Above',
        visible: 'Visible Now',
        tracking: 'Tracking',
        type: 'Type',
        altitude: 'Altitude',
        velocity: 'Velocity',
        orbit: 'Orbit',
        brightness: 'Brightness',
        noradId: 'NORAD ID',
        types: {
          communication: 'Communication',
          navigation: 'Navigation',
          weather: 'Weather',
          scientific: 'Scientific',
          military: 'Military',
          earth_observation: 'Earth Observation',
        },
        orbits: {
          LEO: 'Low Earth Orbit',
          MEO: 'Medium Earth Orbit',
          GEO: 'Geostationary',
          HEO: 'Highly Elliptical',
          ISS: 'International Space Station',
        },
      },
      constellations: {
        title: 'Constellation Explorer',
        visibility: 'Visibility',
        bestSeason: 'Best Season',
        mythology: 'Mythology',
        origin: 'Origin',
        stars: 'Stars',
        highlight: 'Highlight',
      },
      news: {
        title: 'Space News',
        nasa: 'NASA',
        esa: 'ESA',
        isro: 'ISRO',
        spacex: 'SpaceX',
        discovery: 'Discoveries',
        readMore: 'Read More',
      },
      chat: {
        title: 'Zenith AI',
        placeholder: 'Ask about satellites, constellations, planets...',
        send: 'Send',
        thinking: 'Thinking...',
        suggestions: {
          whatSatellites: 'What satellites are above me?',
          whatIsISS: 'What is the ISS?',
          explainOrion: 'Explain the Orion constellation',
          bestViewing: 'Best viewing spots tonight',
        },
      },
      accessibility: {
        title: 'Accessibility',
        highContrast: 'High Contrast Mode',
        reducedMotion: 'Reduced Motion',
        fontSize: 'Font Size',
        textSize: 'Text Size',
        increase: 'Increase',
        decrease: 'Decrease',
        screenReader: 'Screen Reader Mode',
        dyslexiaFont: 'Dyslexia-Friendly Font',
        keyboardNav: 'Keyboard Navigation',
        normal: 'Normal',
        large: 'Large',
        xlarge: 'Extra Large',
        reset: 'Reset All',
      },
      settings: {
        title: 'Settings',
        language: 'Language',
        appearance: 'Appearance',
        theme: 'Theme',
        globeQuality: 'Globe Quality',
        animationSpeed: 'Animation Speed',
        autoRefresh: 'Auto Refresh Interval',
        dayNight: 'Day/Night Mode',
        orbitTrails: 'Show Orbit Trails',
        liveLabels: 'Show Live Labels',
        particleBackground: 'Particle Background',
        cloudLayer: 'Cloud Layer',
        resetDefaults: 'Reset to Defaults',
      },
      stats: {
        satellitesTracked: 'Satellites Tracked',
        visibleNow: 'Visible Now',
        brightest: 'Brightest Object',
        closest: 'Closest Satellite',
        highestPlanet: 'Highest Planet',
      },
      actions: {
        share: 'Share',
        screenshot: 'Screenshot',
        download: 'Download',
        refresh: 'Refresh',
        close: 'Close',
        apply: 'Apply',
        cancel: 'Cancel',
      },
    },
  },
  ta: {
    translation: {
      title: 'ப்ராஜெக்ட் ஜெனித்',
      subtitle: 'வான கண்',
      tagline: 'நிகழ்நேர அண்ட ராடார் தளம்',
      nav: {
        home: 'முகப்பு',
        dashboard: 'டாஷ்போர்டு',
        satellites: 'செயற்கைக்கோள்கள்',
        constellations: 'நட்சத்திரக் கூட்டங்கள்',
        news: 'விண்வெளி செய்திகள்',
        settings: 'அமைப்புகள்',
        about: 'பற்றி',
      },
      search: {
        placeholder: 'இடங்களைத் தேடுங்கள்...',
        useMyLocation: 'என் இருப்பிடத்தைப் பயன்படுத்து',
        enterCoords: 'ஆயங்களை உள்ளிடு',
        latitude: 'அட்சரேகை',
        longitude: 'தீர்க்கரேகை',
        go: 'செல்',
      },
      location: {
        city: 'நகரம்',
        country: 'நாடு',
        region: 'மாநிலம்',
        population: 'மக்கள்தொகை',
        timezone: 'நேர மண்டலம்',
        sunrise: 'சூரிய உதயம்',
        sunset: 'சூரிய அஸ்தமனம்',
        weather: 'வானிலை',
        elevation: 'உயரம்',
        noLocation: 'இடத்தைத் தேர்ந்தெடுக்க கோளத்தில் கிளிக் செய்யவும்',
      },
      satellites: {
        title: 'மேலே உள்ள செயற்கைக்கோள்கள்',
        visible: 'இப்போது தெரிகிறது',
        tracking: 'கண்காணிப்பு',
        type: 'வகை',
        altitude: 'உயரம்',
        velocity: 'வேகம்',
        orbit: 'சுற்றுப்பாதை',
        brightness: 'பிரகாசம்',
      },
      chat: {
        title: 'ஜெனித் AI',
        placeholder: 'செயற்கைக்கோள்கள், நட்சத்திரங்கள் பற்றி கேளுங்கள்...',
        send: 'அனுப்பு',
        thinking: 'சிந்திக்கிறது...',
      },
      settings: {
        title: 'அமைப்புகள்',
        language: 'மொழி',
        appearance: 'தோற்றம்',
      },
    },
  },
  hi: {
    translation: {
      title: 'प्रोजेक्ट ज़ेनिथ',
      subtitle: 'खगोलीय नेत्र',
      tagline: 'वास्तविक समय ब्रह्मांड रडार प्लेटफॉर्म',
      nav: {
        home: 'होम',
        dashboard: 'डैशबोर्ड',
        satellites: 'उपग्रह',
        constellations: 'तारामंडल',
        news: 'अंतरिक्ष समाचार',
        settings: 'सेटिंग्स',
        about: 'के बारे में',
      },
      search: {
        placeholder: 'स्थान खोजें...',
        useMyLocation: 'मेरा स्थान उपयोग करें',
        latitude: 'अक्षांश',
        longitude: 'देशांतर',
      },
      location: {
        city: 'शहर',
        country: 'देश',
        region: 'राज्य',
        weather: 'मौसम',
      },
      satellites: {
        title: 'ऊपर उपग्रह',
        visible: 'अभी दिख रहा है',
      },
      chat: {
        title: 'ज़ेनिथ AI',
        placeholder: 'उपग्रह, तारामंडल के बारे में पूछें...',
      },
    },
  },
  te: {
    translation: {
      title: 'ప్రాజెక్ట్ జెనిత్',
      subtitle: 'ఖగోళ నేత్రం',
      tagline: 'రియల్-టైమ్ కాస్మిక్ రాడార్ ప్లాట్‌ఫారమ్',
      nav: {
        home: 'హోమ్',
        satellites: 'ఉపగ్రహాలు',
        constellations: 'నక్షత్ర సమూహాలు',
        settings: 'సెట్టింగులు',
      },
      satellites: {
        title: 'పైన ఉపగ్రహాలు',
      },
    },
  },
  ml: {
    translation: {
      title: 'പ്രോജക്റ്റ് സെനിത്ത്',
      subtitle: 'ആകാശ നേത്രം',
      tagline: 'റിയൽ-ടൈം കോസ്മിക് റഡാർ പ്ലാറ്റ്ഫോം',
      nav: {
        home: 'ഹോം',
        satellites: 'ഉപഗ്രഹങ്ങൾ',
      },
    },
  },
  kn: {
    translation: {
      title: 'ಪ್ರಾಜೆಕ್ಟ್ ಜೆನಿತ್',
      subtitle: 'ಆಕಾಶ ನೇತ್ರ',
      tagline: 'ನೈಜ-ಸಮಯ ಕಾಸ್ಮಿಕ್ ರಾಡಾರ್ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್',
      nav: {
        home: 'ಹೋಮ್',
        satellites: 'ಉಪಗ್ರಹಗಳು',
      },
    },
  },
  ja: {
    translation: {
      title: 'プロジェクト・ゼニス',
      subtitle: '天体の目',
      tagline: 'リアルタイム宇宙レーダープラットフォーム',
      nav: {
        home: 'ホーム',
        dashboard: 'ダッシュボード',
        satellites: '衛星',
        constellations: '星座',
        news: '宇宙ニュース',
        settings: '設定',
      },
      search: {
        placeholder: '場所を検索...',
        useMyLocation: '現在地を使用',
      },
      satellites: {
        title: '上空の衛星',
        visible: '現在見えます',
      },
      chat: {
        title: 'ゼニスAI',
        placeholder: '衛星、星座、惑星について...',
      },
    },
  },
  zh: {
    translation: {
      title: '天顶计划',
      subtitle: '天体之眼',
      tagline: '实时宇宙雷达平台',
      nav: {
        home: '首页',
        dashboard: '仪表板',
        satellites: '卫星',
        constellations: '星座',
        news: '太空新闻',
        settings: '设置',
      },
      search: {
        placeholder: '搜索位置...',
        useMyLocation: '使用我的位置',
      },
      satellites: {
        title: '上空卫星',
        visible: '当前可见',
      },
    },
  },
  es: {
    translation: {
      title: 'Proyecto Zenith',
      subtitle: 'El Ojo Celestial',
      tagline: 'Plataforma de Radar Cósmico en Tiempo Real',
      nav: {
        home: 'Inicio',
        dashboard: 'Panel',
        satellites: 'Satélites',
        constellations: 'Constelaciones',
        news: 'Noticias Espaciales',
        settings: 'Configuración',
      },
      search: {
        placeholder: 'Buscar ubicaciones...',
        useMyLocation: 'Usar mi ubicación',
      },
      satellites: {
        title: 'Satélites Encima',
        visible: 'Visible Ahora',
      },
      chat: {
        title: 'Zenith AI',
        placeholder: 'Pregunta sobre satélites, constelaciones...',
      },
    },
  },
  fr: {
    translation: {
      title: 'Projet Zenith',
      subtitle: "L'Œil Céleste",
      tagline: 'Plateforme Radar Cosmique en Temps Réel',
      nav: {
        home: 'Accueil',
        satellites: 'Satellites',
        constellations: 'Constellations',
        news: 'Actualités Spatiales',
        settings: 'Paramètres',
      },
      search: {
        placeholder: 'Rechercher des lieux...',
        useMyLocation: 'Utiliser ma position',
      },
      satellites: {
        title: 'Satellites Au-dessus',
        visible: 'Visible Maintenant',
      },
    },
  },
  de: {
    translation: {
      title: 'Projekt Zenith',
      subtitle: 'Das Himmlische Auge',
      tagline: 'Echtzeit-Kosmisches-Radar-Plattform',
      nav: {
        home: 'Startseite',
        satellites: 'Satelliten',
        constellations: 'Sternbilder',
        news: 'Weltraumnachrichten',
        settings: 'Einstellungen',
      },
      search: {
        placeholder: 'Standorte suchen...',
        useMyLocation: 'Meinen Standort verwenden',
      },
      satellites: {
        title: 'Satelliten Überhead',
        visible: 'Gerade Sichtbar',
      },
    },
  },
  ar: {
    translation: {
      title: 'مشروع ذروة السماء',
      subtitle: 'العين السماوية',
      tagline: 'منصة رادار كونية في الوقت الحقيقي',
      nav: {
        home: 'الرئيسية',
        satellites: 'الأقمار الصناعية',
        constellations: 'الأبراج',
        news: 'أخبار الفضاء',
        settings: 'الإعدادات',
      },
      search: {
        placeholder: 'البحث عن المواقع...',
        useMyLocation: 'استخدام موقعي',
      },
      satellites: {
        title: 'الأقمار الصناعية أعلاه',
        visible: 'مرئية الآن',
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
