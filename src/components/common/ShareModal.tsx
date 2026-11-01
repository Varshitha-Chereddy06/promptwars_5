import React, { useState } from 'react';
import { Share2, Copy, Check, Download, FileJson, X, Globe, Sparkles } from 'lucide-react';
import { FullEventPlan } from '../../types';
import { generateShareableUrl, exportPlanAsJSON } from '../../services/storageService';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: FullEventPlan;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, plan }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = generateShareableUrl(plan);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      // Fallback: select the input text for manual copy
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportJSON = () => {
    exportPlanAsJSON(plan);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="share-modal-title">
      <div className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-900/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-100 dark:bg-amber-950/60 text-amber-600 rounded-xl">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 id="share-modal-title" className="text-base font-semibold text-stone-900 dark:text-stone-100">
                Share & Export Event Plan
              </h2>
              <p className="text-xs text-stone-500">Collaborate with co-hosts, family, or committees</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Share Link Box */}
          <div className="space-y-2">
            <label htmlFor="share-url-input" className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400">
              Instant Shareable Plan Link
            </label>
            <div className="flex items-center gap-2">
              <input
                id="share-url-input"
                type="text"
                readOnly
                value={shareUrl}
                aria-label="Shareable plan URL"
                className="flex-1 px-3.5 py-2.5 text-xs bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-700 dark:text-stone-300 font-mono truncate select-all focus:outline-none"
              />
              <button
                onClick={handleCopy}
                aria-label={copied ? 'Link copied to clipboard' : 'Copy link to clipboard'}
                className={`px-4 py-2.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-[11px] text-stone-500">
              Anyone with this link can open your complete budget, timeline, and vendor matrix instantly in their browser!
            </p>
          </div>

          {/* Export JSON Option */}
          <div className="p-4 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-200 dark:border-stone-700/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-950/60 text-blue-600 rounded-lg">
                <FileJson className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-900 dark:text-stone-100">Export Raw Plan (.json)</p>
                <p className="text-[11px] text-stone-500">Download complete backup file for offline archiving</p>
              </div>
            </div>
            <button
              onClick={handleExportJSON}
              className="px-3.5 py-2 text-xs font-medium bg-white dark:bg-stone-700 border border-stone-200 dark:border-stone-600 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-600 rounded-xl flex items-center gap-1.5 shadow-sm transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
