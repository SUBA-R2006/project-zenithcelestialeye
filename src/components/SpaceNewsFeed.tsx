import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Newspaper,
  ExternalLink,
  Rocket,
  Satellite,
  Telescope,
  Globe,
} from 'lucide-react';
import { spaceNews } from '../data/constants';

const sourceIcons: Record<string, React.ReactNode> = {
  nasa: <Rocket className="w-4 h-4" />,
  esa: <Telescope className="w-4 h-4" />,
  isro: <Satellite className="w-4 h-4" />,
  spacex: <Rocket className="w-4 h-4" />,
  discovery: <Globe className="w-4 h-4" />,
};

const sourceColors: Record<string, string> = {
  nasa: 'bg-blue-500/20 text-blue-400',
  esa: 'bg-purple-500/20 text-purple-400',
  isro: 'bg-orange-500/20 text-orange-400',
  spacex: 'bg-cyan-500/20 text-cyan-400',
  discovery: 'bg-green-500/20 text-green-400',
};

export default function SpaceNewsFeed() {
  const { t } = useTranslation();

  return (
    <div className="glass-panel h-full flex flex-col">
      <div className="p-4 border-b border-white/10">
        <h3 className="font-orbitron font-semibold flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-accent-400" />
          {t('news.title')}
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto hide-scrollbar p-3 space-y-3">
        {spaceNews.map((news, index) => (
          <motion.a
            key={news.id}
            href={news.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="block p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all group"
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${sourceColors[news.category]}`}
              >
                {sourceIcons[news.category]}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm leading-snug group-hover:text-accent-400 transition-colors">
                  {news.title}
                </h4>
                <p className="text-xs text-white/50 mt-1 line-clamp-2">{news.summary}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-white/40">
                  <span className="flex items-center gap-1">
                    {sourceIcons[news.category]}
                    {news.source}
                  </span>
                  <span>{news.publishedAt}</span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-white/30 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
