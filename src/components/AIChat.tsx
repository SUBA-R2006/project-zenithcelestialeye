import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
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
  constellations: [
    "Tonight, you can see several prominent constellations! Orion is visible in the winter sky, while the Big Dipper (Ursa Major) is circumpolar and visible year-round in the northern hemisphere.",
    "The constellation of Orion contains the famous Orion Nebula (M42), a stellar nursery where new stars are being born. It's visible to the naked eye as the middle 'star' of Orion's sword.",
    "Different cultures have different names for constellations. What we call the Big Dipper is known as the Great Bear in Greek mythology, the Plough in the UK, and Saptarishi in Indian astronomy.",
  ],
  planets: [
    "Currently in the night sky: Venus is the brightest 'evening star' visible after sunset. Jupiter and Saturn are also prominent this season, with Jupiter being the second brightest planet after Venus.",
    "Mars is at opposition this month, meaning it's at its closest approach to Earth and visible all night long. Look for its distinctive red color rising in the east after sunset.",
    "Mercury is tricky to spot! It's only visible shortly after sunset or before sunrise, never more than 28 degrees from the Sun. Best viewing opportunities occur during its greatest elongation.",
  ],
  general: [
    "I'm Zenith AI, your astronomy assistant! I can help you identify satellites, constellations, planets, and other celestial objects. Just ask me anything about the night sky!",
    "The cosmos is vast and fascinating! Did you know that light from the nearest star system (Alpha Centauri) takes over 4 years to reach us? And that's considered 'close' in cosmic terms!",
    "Space agencies worldwide are working on exciting missions. NASA's Artemis program aims to return humans to the Moon, while ESA's JUICE mission will explore Jupiter's icy moons.",
    "The James Webb Space Telescope (JWST) is revolutionizing our understanding of the universe! Its infrared observations allow us to peer through cosmic dust and see the earliest galaxies.",
  ],
};

function getAIResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  let category = 'general';

  if (lowerMessage.includes('satellite') || lowerMessage.includes('iss') || lowerMessage.includes('hubble')) {
    const count = sampleSatellites.length;
    const response = aiResponses.satellites[Math.floor(Math.random() * aiResponses.satellites.length)];
    return response.replace('{count}', String(count));
  }
  if (lowerMessage.includes('constellation') || lowerMessage.includes('star') || lowerMessage.includes('orion')) {
    category = 'constellations';
  }
  if (lowerMessage.includes('planet') || lowerMessage.includes('mars') || lowerMessage.includes('jupiter') || lowerMessage.includes('venus')) {
    category = 'planets';
  }

  return aiResponses[category][Math.floor(Math.random() * aiResponses[category].length)];
}

export default function AIChat() {
  const { t } = useTranslation();
  const { chatMessages, addChatMessage, clearChat } = useAppStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  // Quick suggestions
  const suggestions = [
    { icon: <Satellite className="w-3 h-3" />, text: t('ai.suggestions.satellites') },
    { icon: <Star className="w-3 h-3" />, text: t('ai.suggestions.constellations') },
    { icon: <Globe2 className="w-3 h-3" />, text: t('ai.suggestions.planets') },
  ];

  const handleSend = () => {
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

    // Simulate AI thinking
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getAIResponse(input),
        timestamp: new Date(),
      };
      addChatMessage(aiMessage);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleSuggestionClick = (text: string) => {
    setInput(text);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Sparkles className="w-5 h-5 text-primary-400" />
            <div className="absolute inset-0 bg-primary-400/30 blur-md rounded-full" />
          </div>
          <div>
            <h3 className="font-orbitron font-semibold text-sm">Zenith AI</h3>
            <p className="text-[10px] text-white/50">{t('ai.subtitle')}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={clearChat}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/50 hover:text-white"
            title={t('actions.clearChat')}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => useAppStore.getState().toggleChat()}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/50 hover:text-white"
            title={t('actions.close')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 scroll-container">
        {chatMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500/30 to-accent-500/30 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-primary-400" />
            </div>
            <h4 className="font-semibold mb-2">{t('ai.welcome')}</h4>
            <p className="text-sm text-white/60 mb-4">{t('ai.welcomeMessage')}</p>

            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(s.text)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full text-xs transition-colors"
                >
                  {s.icon}
                  <span>{s.text}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {chatMessages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'user'
                      ? 'bg-accent-500/20 text-accent-400'
                      : 'bg-primary-500/20 text-primary-400'
                  }`}
                >
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div
                  className={`px-3 py-2 rounded-xl text-sm max-w-[80%] ${
                    msg.role === 'user'
                      ? 'bg-accent-500/20 text-white'
                      : 'bg-white/10 text-white/90'
                  }`}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-primary-500/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary-400" />
                </div>
                <div className="bg-white/10 px-3 py-2 rounded-xl">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-white/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('ai.placeholder')}
            className="cosmic-input flex-1 py-2 text-sm"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl transition-all hover:from-primary-500 hover:to-accent-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
