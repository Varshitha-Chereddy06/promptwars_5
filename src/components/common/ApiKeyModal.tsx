import React, { useState, useEffect } from 'react';
import { Key, ShieldCheck, ExternalLink, X, CheckCircle2, Sparkles } from 'lucide-react';
import {
  AIProvider,
  getAIProviderSettings,
  getStoredApiKey,
  setAIProviderSettings,
  setStoredApiKey
} from '../../services/storageService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeyUpdated: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onKeyUpdated }) => {
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState<AIProvider>('gemini');
  const [baseUrl, setBaseUrl] = useState('');
  const [model, setModel] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setApiKey(getStoredApiKey());
      const settings = getAIProviderSettings();
      setProvider(settings.provider);
      setBaseUrl(settings.baseUrl);
      setModel(settings.model);
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    setStoredApiKey(apiKey);
    setAIProviderSettings({ provider, baseUrl, model });
    setSavedSuccess(true);
    onKeyUpdated();
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    setApiKey('');
    setStoredApiKey('');
    setSavedSuccess(true);
    onKeyUpdated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="api-modal-title">
      <div className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-900/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-100 dark:bg-rose-950/60 text-rose-600 rounded-xl">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 id="api-modal-title" className="text-base font-semibold text-stone-900 dark:text-stone-100">
                AI Engine Settings
              </h2>
              <p className="text-xs text-stone-500">Choose live AI or offline local reasoning</p>
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
        <div className="p-6 space-y-4">
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Dual-Mode AI Guarantee</p>
              <p className="mt-0.5 text-emerald-700 dark:text-emerald-400">
                Soirée runs without an API key using its built-in offline response engine. A key enables live generation from the selected provider.
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="ai-provider" className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400">
              Live AI provider
            </label>
            <select
              id="ai-provider"
              value={provider}
              onChange={(e) => setProvider(e.target.value as AIProvider)}
              className="w-full px-3.5 py-2.5 text-sm bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100"
            >
              <option value="gemini">Google Gemini</option>
              <option value="openai-compatible">OpenAI-compatible API router</option>
            </select>

            {provider === 'openai-compatible' && (
              <div className="space-y-3 pt-1">
                <div>
                  <label htmlFor="ai-base-url" className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1.5">
                    API base URL
                  </label>
                  <input
                    id="ai-base-url"
                    type="url"
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                    placeholder="https://router.example/v1"
                    className="w-full px-3.5 py-2.5 text-sm bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 font-mono"
                  />
                </div>
                <div>
                  <label htmlFor="ai-model" className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1.5">
                    Model name
                  </label>
                  <input
                    id="ai-model"
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="Enter a model enabled for your router"
                    className="w-full px-3.5 py-2.5 text-sm bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 font-mono"
                    required
                  />
                </div>
              </div>
            )}

            <label htmlFor="ai-key-input" className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400">
              {provider === 'gemini' ? 'Gemini API key' : 'Router API key'}
            </label>
            <div className="relative">
              <input
                id="ai-key-input"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste your API key"
                autoComplete="off"
                spellCheck={false}
                className="w-full px-3.5 py-2.5 text-sm bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-rose-500 transition font-mono"
              />
            </div>
            <p className="text-[11px] text-stone-500 flex items-center justify-between mt-1">
              <span>Stored in this browser only. Do not use a browser-stored key on a public deployment.</span>
              {provider === 'gemini' && (
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rose-600 hover:text-rose-700 inline-flex items-center gap-1 font-medium underline"
                >
                  Get free Gemini Key <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </p>
          </div>

          {savedSuccess && (
            <div className="p-3 bg-emerald-100 dark:bg-emerald-950/50 border border-emerald-300 text-emerald-800 dark:text-emerald-200 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Settings updated successfully!</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-between text-xs text-stone-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>API requests send your prompt and event context to the selected provider.</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50">
          {apiKey && (
            <button
              onClick={handleClear}
              className="px-3.5 py-2 text-xs font-medium text-stone-600 dark:text-stone-300 hover:text-red-600 transition"
            >
              Clear Key
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm hover:shadow transition"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
