import React, { useState } from 'react';
import { Copy, Check, Type, Flower2, Wand2 } from 'lucide-react';
import { MoodboardTheme } from '../../types';
import { PRESET_THEMES } from '../../constants/presets';

interface MoodboardTabProps {
  activeTheme?: MoodboardTheme;
  onSelectTheme: (theme: MoodboardTheme) => void;
  onTriggerAIThemeStudio: () => void;
}

export const MoodboardTab: React.FC<MoodboardTabProps> = ({
  activeTheme = PRESET_THEMES[0],
  onSelectTheme,
  onTriggerAIThemeStudio
}) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
            Mood Board & Palette Studio
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Curate color swatches, typography pairings, and tactile decor guidelines
          </p>
        </div>

        <button
          onClick={onTriggerAIThemeStudio}
          className="px-4 py-2 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center gap-1.5 transition shadow-sm"
        >
          <Wand2 className="w-4 h-4 text-rose-500" />
          <span>Generate AI Palette</span>
        </button>
      </div>

      {/* Theme Presets Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {PRESET_THEMES.map((theme) => {
          const isSelected = activeTheme.id === theme.id;
          return (
            <button
              key={theme.id}
              onClick={() => onSelectTheme(theme)}
              className={`px-4 py-2 text-xs font-semibold rounded-2xl border transition-all flex items-center gap-2 flex-shrink-0 ${
                isSelected
                  ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900 border-stone-900 shadow-sm'
                  : 'bg-white dark:bg-stone-850 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center -space-x-1">
                {theme.palette.slice(0, 3).map((c, i) => (
                  <span
                    key={i}
                    className="w-3 h-3 rounded-full border border-white dark:border-stone-800"
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
              <span>{theme.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active Theme Spotlight Card */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 dark:border-stone-800 space-y-6">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-rose-600 dark:text-rose-400">
            Active Visual Identity
          </span>
          <h3 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1">
            {activeTheme.name}
          </h3>
          <p className="text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-2xl">
            {activeTheme.description}
          </p>
        </div>

        {/* Color Swatches Grid */}
        <div className="space-y-3">
          <h4 className="text-xs uppercase font-semibold text-stone-500 tracking-wider">
            Color Palette & Hex Codes (Tap to copy)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
            {activeTheme.palette.map((color) => {
              const isCopied = copiedHex === color.hex;

              return (
                <div
                  key={color.hex}
                  onClick={() => handleCopyHex(color.hex)}
                  className="group relative cursor-pointer rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                >
                  {/* Swatch color block */}
                  <div
                    className="h-24 w-full flex items-end justify-end p-2"
                    style={{ backgroundColor: color.hex }}
                  >
                    <span className="p-1 rounded-lg bg-black/40 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition text-[10px] flex items-center gap-1">
                      {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </span>
                  </div>

                  {/* Swatch details */}
                  <div className="p-3 bg-white dark:bg-stone-850">
                    <span className="font-mono text-xs font-bold text-stone-900 dark:text-stone-100 block">
                      {color.hex}
                    </span>
                    <span className="text-[11px] text-stone-600 dark:text-stone-400 block truncate font-medium">
                      {color.name}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 block mt-0.5 capitalize">
                      {color.role}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Secondary Info: Typography & Decor Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-stone-100 dark:border-stone-800">
          
          {/* Typography Pairings */}
          <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-800 space-y-3">
            <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-semibold text-sm">
              <Type className="w-4 h-4 text-rose-500" />
              <span>Recommended Typography Pairings</span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-stone-400 uppercase text-[10px] block font-semibold">Heading Display:</span>
                <span className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 block">
                  {activeTheme.fontPairing.heading}
                </span>
              </div>

              <div>
                <span className="text-stone-400 uppercase text-[10px] block font-semibold">Body Sans-Serif:</span>
                <span className="font-sans text-sm text-stone-700 dark:text-stone-300 block">
                  {activeTheme.fontPairing.body}
                </span>
              </div>
            </div>
          </div>

          {/* Decor Elements */}
          <div className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/80 dark:border-stone-800 space-y-3">
            <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-semibold text-sm">
              <Flower2 className="w-4 h-4 text-emerald-500" />
              <span>Signature Styling Cues</span>
            </div>

            <ul className="space-y-1.5 text-xs text-stone-600 dark:text-stone-400">
              {activeTheme.decorElements.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2 flex flex-wrap gap-1.5">
              {activeTheme.stylingKeywords.map((tag) => (
                <span key={tag} className="px-2 py-0.5 rounded-md bg-stone-200/60 dark:bg-stone-750 text-[10px] font-semibold text-stone-600 dark:text-stone-300">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
