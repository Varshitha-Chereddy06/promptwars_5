import React from 'react';
import { Sparkles, Share2, Key, Bot } from 'lucide-react';
import { EventType, PlanHealthMetrics } from '../../types';
import { EVENT_TYPE_METADATA } from '../../constants/presets';

interface NavbarProps {
  currentType: EventType;
  onSelectType: (type: EventType) => void;
  healthMetrics: PlanHealthMetrics;
  hasApiKey: boolean;
  onOpenApiKeyModal: () => void;
  onOpenShareModal: () => void;
  onToggleAIChat: () => void;
  isAIChatOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentType,
  onSelectType,
  healthMetrics,
  hasApiKey,
  onOpenApiKeyModal,
  onOpenShareModal,
  onToggleAIChat,
  isAIChatOpen
}) => {
  const meta = EVENT_TYPE_METADATA[currentType];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white shadow-md shadow-rose-500/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                  Soirée
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300">
                  AI Planner
                </span>
              </div>
              <p className="text-[11px] text-stone-500 hidden sm:block">
                Intelligent Weddings, Birthdays & Community Events
              </p>
            </div>
          </div>

          {/* Event Type Switcher Segmented Control */}
          <div className="flex items-center p-1 bg-stone-100 dark:bg-stone-800 rounded-2xl border border-stone-200/60 dark:border-stone-700/60" role="tablist" aria-label="Event Type Selection">
            <button
              role="tab"
              aria-selected={currentType === 'wedding'}
              onClick={() => onSelectType('wedding')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                currentType === 'wedding'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <span>💍</span>
              <span className="hidden md:inline">Wedding</span>
            </button>

            <button
              role="tab"
              aria-selected={currentType === 'birthday'}
              onClick={() => onSelectType('birthday')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                currentType === 'birthday'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <span>🎂</span>
              <span className="hidden md:inline">Birthday</span>
            </button>

            <button
              role="tab"
              aria-selected={currentType === 'community'}
              onClick={() => onSelectType('community')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                currentType === 'community'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-sm'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <span>🤝</span>
              <span className="hidden md:inline">Community</span>
            </button>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2">
            
            {/* Plan Health Pill */}
            <div
              title={`Plan Health: ${healthMetrics.score}/100 (${healthMetrics.rating})`}
              className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium border ${
                healthMetrics.score >= 80
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                  : healthMetrics.score >= 60
                  ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                  : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full animate-ping ${
                  healthMetrics.score >= 80 ? 'bg-emerald-500' : healthMetrics.score >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
              />
              <span>Health: <strong>{healthMetrics.score}%</strong></span>
            </div>

            {/* AI Key Status Button */}
            <button
              onClick={onOpenApiKeyModal}
              title={hasApiKey ? 'Gemini Live AI Key Active' : 'Offline Local AI Active (Click to add Gemini Key)'}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-xl transition"
            >
              <Key className="w-3.5 h-3.5 text-rose-500" />
              <span className="hidden sm:inline">{hasApiKey ? 'Gemini API' : 'Local AI'}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${hasApiKey ? 'bg-emerald-500' : 'bg-blue-400'}`} />
            </button>

            {/* Share Button */}
            <button
              onClick={onOpenShareModal}
              title="Share or Export Event Plan"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-xl transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>

            {/* AI Co-Pilot Toggle */}
            <button
              onClick={onToggleAIChat}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl transition shadow-sm ${
                isAIChatOpen
                  ? 'bg-rose-600 text-white shadow-rose-500/20'
                  : 'bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>AI Co-Pilot</span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
