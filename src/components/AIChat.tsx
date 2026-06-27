import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Sparkles,
  X,
  RotateCcw,
  Bot,
  User,
  Satellite,
  Star,
  Globe2,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import type { ChatMessage } from '../types';
import { sampleSatellites } from '../data/constants';

const aiResponses: Record<string, string[]> = {
  satellites: [
    "Currently tracking {count} satellites in orbit. The most notable ones include the International Space Station (ISS) at 420km altitude, Hubble Space Telescope at 540km, and numerous Starlink satellites delivering internet coverage worldwide.",
    "Above your location, the brightest satellite visible is the ISS (International Space Station). It orbits at 420km with a speed of 7.66 km/s, completing one orbit every 90 minutes!",
    "There are over 6,000 active satellites orbiting Earth. About 52% are communication satellites like Starlink, 24% are navigation satellites like GPS, and 18% are Earth observation satellites monitoring climate and weather.",
  ],
  iss: [
    "The International Space Station (ISS) is humanity's largest space structure! Orbiting at 420 km altitude, it travels at 27,600 km/h (7.66 km/s), circling Earth every 90 minutes. The ISS has been continuously occupied since November 2000.",
    "Fun fact: The ISS is so bright (magnitude -3.8) that it's visible even in light-polluted cities! It appears as a steady, fast-moving point of light. Use apps like ISS Detector to know when it passes over you.",
    "The ISS weighs about 420,000 kg and has about 916 cubic meters of pressurized space - larger than a 6-bedroom house! It hosts up to 6 astronauts conducting experiments in microgravity.",
  ],
  orion: [
    "Orion the Hunter is one of the most recognizable constellations! Named after a Greek mythological hunter, it features the famous 'Belt of Orion' - three bright stars in a row: Alnitak, Alnilam, and Mintaka.",
    "Orion's brightest stars are Rigel (blue supergiant, 773 light-years away) and Betelgeuse (red supergiant, ~700 light-years). Betelgeuse is so huge that if placed at the Sun's position, it would engulf Mercury, Venus, Earth, and Mars!",
    "Below Orion's belt lies the Orion Nebula (M42) - a stellar nursery 1,344 light-years away where new stars are being born. Visible to the naked eye as a fuzzy star, it's one of the most photographed objects in the night sky!",
  ],
  planets: [
    "Tonight, Jupiter and Saturn are the most prominent planets visible. Venus (the 'Evening Star') is visible shortly after sunset, while Mars rises around midnight with its distinctive red-orange color.",
    "Did you know? A day on Venus is longer than its year! Venus rotates so slowly that one day there equals 243 Earth days, while it orbits the Sun in just 225 days.",
    "The gas giants Jupiter and Saturn are best viewed when they're at 'opposition' - opposite the Sun in our sky. Jupiter's 4 largest moons (Galilean moons) are visible with binoculars!",
  ],
  general: [
    "The universe is estimated to be 13.8 billion years old, containing over 200 billion galaxies, each with hundreds of billions of stars. Our Milky Way alone has 100-400 billion stars!",
    "Light from the Sun takes 8 minutes to reach Earth. Light from the next nearest star (Proxima Centauri) takes over 4 years. The most distant visible star (Earendel) is 12.9 billion light-years away!",
    "Space is mostly empty! If the Sun were the size of a white blood cell, the Milky Way would be the size of the continental United States. The nearest galaxy (Andromeda) is 25 Milky Way diameters away.",
  ],
  weather: [
    "Solar weather can affect satellite operations! Solar flares and coronal mass ejections (CMEs) can disrupt communications and even cause satellite drag. Space agencies monitor 'space weather' continuously.",
    "The aurora borealis (Northern Lights) is caused by solar particles interacting with Earth's magnetic field. During strong solar storms, auroras can be seen much farther south than usual!",
  ],
};

function getAIResponse(query: string): string {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('satellite') || lowerQuery.includes('above') || lowerQuery.includes('tracking')) {
    const responses = aiResponses.satellites;
    return responses[Math.floor(Math.random() * responses.length)].replace('{count}', sampleSatellites.length.toString());
  }

  if (lowerQuery.includes('iss') || lowerQuery.includes('international space station')) {
    return aiResponses.iss[Math.floor(Math.random() * aiResponses.iss.length)];
  }

  if (lowerQuery.includes('orion') || lowerQuery.includes('constellation')) {
    return aiResponses.orion[Math.floor(Math.random() * aiResponses.orion.length)];
  }

  if (lowerQuery.includes('planet') || lowerQuery.includes('jupiter') || lowerQuery.includes('saturn') || lowerQuery.includes('venus') || lowerQuery.includes('mars')) {
    return aiResponses.planets[Math.floor(Math.random() * aiResponses.planets.length)];
  }

  if (lowerQuery.includes('weather') || lowerQuery.includes('solar') || lowerQuery.includes('aurora')) {
    return aiResponses.weather[Math.floor(Math.random() * aiResponses.weather.length)];
  }

  return aiResponses.general[Math.floor(Math.random() * aiResponses.general.length)];
}

export default function AIChat() {
  const { t } = useTranslation();
  const { chatMessages, addChatMessage, clearChat, isChatOpen, toggleChat } = useAppStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    addChatMessage(userMessage);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = getAIResponse(input);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      addChatMessage(aiMessage);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const suggestions = [
    { icon: <Satellite className="w-4 h-4" />, text: t('chat.suggestions.whatSatellites') },
    { icon: <Star className="w-4 h-4" />, text: t('chat.suggestions.explainOrion') },
    { icon: <Globe2 className="w-4 h-4" />, text: t('chat.suggestions.whatIsISS') },
  ];

  return (
    <AnimatePresence>
      {isChatOpen && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          className="fixed right-0 top-16 bottom-0 w-full md:w-[400px] z-50 flex flex-col bg-cosmic-dark/95 backdrop-blur-xl border-l border-white/10"
        >
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-orbitron font-semibold">{t('chat.title')}</h3>
                <p className="text-xs text-white/50">Astronomy Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearChat}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                title="Clear chat"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={toggleChat}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar">
            {chatMessages.length === 0 && (
              <div className="text-center py-8 space-y-6">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary-500/30 to-accent-500/30 flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-primary-400" />
                </div>
                <div>
                  <p className="text-white/80 mb-1">Welcome to Zenith AI</p>
                  <p className="text-sm text-white/50">Ask me about satellites, constellations, planets, and more!</p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {suggestions.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setInput(s.text)}
                      className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors"
                    >
                      {s.icon}
                      <span className="text-white/70">{s.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${
                    message.role === 'user'
                      ? 'bg-primary-500/30'
                      : 'bg-gradient-to-br from-accent-500/30 to-primary-500/30'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 text-primary-400" />
                  ) : (
                    <Bot className="w-4 h-4 text-accent-400" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-primary-500/20 rounded-tr-sm'
                      : 'bg-white/10 rounded-tl-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-500/30 to-primary-500/30 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-accent-400" />
                </div>
                <div className="bg-white/10 rounded-2xl rounded-tl-sm p-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t('chat.placeholder')}
                className="cosmic-input flex-1"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="btn-primary px-4 disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
