import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/useAppStore';
import { Satellite, Star, MessageCircle, Menu, Info } from 'lucide-react';

interface MobileNavProps {
  onSidebarClick: () => void;
  onRightPanelClick: () => void;
}

export default function MobileNav({ onSidebarClick, onRightPanelClick }: MobileNavProps) {
  const { t } = useTranslation();
  const { isChatOpen, toggleChat } = useAppStore();

  const items = [
    { icon: <Menu className="w-5 h-5" />, label: 'Menu', onClick: onSidebarClick },
    { icon: <Satellite className="w-5 h-5" />, label: t('nav.satellites'), onClick: onSidebarClick },
    { icon: <Star className="w-5 h-5" />, label: t('nav.constellations'), onClick: onSidebarClick },
    { icon: <Info className="w-5 h-5" />, label: 'Info', onClick: onRightPanelClick },
    { icon: <MessageCircle className="w-5 h-5" />, label: 'AI', onClick: toggleChat, active: isChatOpen },
  ];

  return (
    <div className="mobile-nav">
      {items.map((item, i) => (
        <button
          key={i}
          onClick={item.onClick}
          className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors min-w-[48px] ${
            item.active ? 'text-primary-400' : 'text-white/60 hover:text-white'
          }`}
        >
          {item.icon}
          <span className="text-[10px]">{item.label}</span>
        </button>
      ))}
    </div>
  );
}
