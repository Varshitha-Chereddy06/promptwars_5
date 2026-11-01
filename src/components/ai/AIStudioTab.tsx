import React, { useState } from 'react';
import {
  Wand2,
  Palette,
  Clock,
  Mail,
  Wine,
  ShieldAlert,
  PiggyBank,
  Sparkles,
  Megaphone,
  Copy,
  Check,
  RefreshCw
} from 'lucide-react';
import { FullEventPlan, AIToolResult } from '../../types';
import { executeAITool } from '../../services/aiService';

interface AIStudioTabProps {
  plan: FullEventPlan;
  initialToolId?: string;
  onSaveAIOutput: (toolId: string, result: AIToolResult) => void;
}

export const AIStudioTab: React.FC<AIStudioTabProps> = ({
  plan,
  initialToolId = 'theme_studio',
  onSaveAIOutput
}) => {
  const [selectedToolId, setSelectedToolId] = useState(initialToolId);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentResult, setCurrentResult] = useState<string | null>(
    plan.aiSavedOutputs[initialToolId]?.content || null
  );
  const [copied, setCopied] = useState(false);

  // Dynamic parameters for specific tools
  const [toastSpeaker, setToastSpeaker] = useState(
    plan.details.type === 'wedding' ? 'Maid of Honor' : 'Host'
  );
  const [toastTone, setToastTone] = useState('Heartfelt with gentle humor');
  const [crisisInput, setCrisisInput] = useState(
    'Torrential unexpected rain on an outdoor ceremony'
  );

  const tools = [
    {
      id: 'theme_studio',
      title: 'Theme Studio',
      description: 'Curates breathtaking themes, aesthetic concepts, and interactive hex color swatches.',
      icon: Palette,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60'
    },
    {
      id: 'run_of_show',
      title: 'Run-of-Show',
      description: 'Creates minute-by-minute operational schedules from morning load-in to midnight send-off.',
      icon: Clock,
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/60'
    },
    {
      id: 'invite_writer',
      title: 'Invite Writer',
      description: 'Crafts invitation suites in 3 distinct tones plus an instant 1-click WhatsApp/SMS version.',
      icon: Mail,
      color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/60'
    },
    {
      id: 'toast_speech',
      title: 'Toast & Speech',
      description: 'Writes emotional, unforgettable toasts for Maid of Honor, Best Man, Host, or Keynote.',
      icon: Wine,
      color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/60'
    },
    {
      id: 'disaster_doctor',
      title: 'Disaster Doctor',
      description: 'Instant contingency protocols: Plan A, Plan B, and Plan C when unexpected emergencies hit.',
      icon: ShieldAlert,
      color: 'text-red-500 bg-red-50 dark:bg-red-950/60'
    },
    {
      id: 'budget_hacker',
      title: 'Budget Hacker',
      description: 'Audits expenses and pinpoints practical 15-20% cost-cutting hacks without sacrificing luxury.',
      icon: PiggyBank,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60'
    },
    {
      id: 'surprise_moments',
      title: 'Surprise Moments',
      description: 'Brainstorms 5 bespoke, unforgettable wow-factors tailored to your guest demographic.',
      icon: Sparkles,
      color: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-950/60'
    },
    {
      id: 'sponsor_pitch',
      title: 'Sponsor Pitch',
      description: 'Generates tier packages, corporate prospectus copy, and cold email outreach templates.',
      icon: Megaphone,
      color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/60'
    }
  ];

  const activeTool = tools.find(t => t.id === selectedToolId) || tools[0];

  const handleSelectTool = (id: string) => {
    setSelectedToolId(id);
    setCurrentResult(plan.aiSavedOutputs[id]?.content || null);
  };

  const handleRunGenerator = async () => {
    setIsGenerating(true);
    try {
      const res = await executeAITool({
        toolId: selectedToolId,
        plan,
        customPrompt: selectedToolId === 'disaster_doctor' ? crisisInput : undefined,
        additionalParams: {
          speaker: toastSpeaker,
          tone: toastTone,
          crisis: crisisInput
        }
      });
      setCurrentResult(res.content);
      onSaveAIOutput(selectedToolId, res);
    } catch (err) {
      console.error('AI execution error', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyContent = () => {
    if (!currentResult) return;
    navigator.clipboard.writeText(currentResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-2xl font-bold text-stone-900 dark:text-stone-100">
              AI Event Studio
            </h2>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
              8 Tailored Tools
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Personalized intelligence grounded in your date, venue, budget, and guest count
          </p>
        </div>

        <button
          onClick={handleRunGenerator}
          disabled={isGenerating}
          className="px-5 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl flex items-center gap-2 shadow-sm transition disabled:opacity-50"
        >
          {isGenerating ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Wand2 className="w-4 h-4" />
          )}
          <span>{isGenerating ? 'Synthesizing with AI...' : `Generate ${activeTool.title}`}</span>
        </button>
      </div>

      {/* Main Studio 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: 8 Tool Buttons (4 cols) */}
        <div className="lg:col-span-4 space-y-2">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const isSelected = selectedToolId === tool.id;
            const hasSavedOutput = Boolean(plan.aiSavedOutputs[tool.id]);

            return (
              <button
                key={tool.id}
                onClick={() => handleSelectTool(tool.id)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                  isSelected
                    ? 'bg-white dark:bg-stone-900 border-rose-500 ring-2 ring-rose-500/20 shadow-md'
                    : 'bg-white/60 dark:bg-stone-900/60 border-stone-200 dark:border-stone-800 hover:bg-white dark:hover:bg-stone-900'
                }`}
              >
                <div className={`p-2 rounded-xl flex-shrink-0 ${tool.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                      {tool.title}
                    </span>
                    {hasSavedOutput && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500" title="Saved output ready" />
                    )}
                  </div>
                  <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                    {tool.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Active Tool Config & Markdown Result (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200 dark:border-stone-800 space-y-5">
          
          {/* Active Tool Header */}
          <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-2xl ${activeTool.color}`}>
                <activeTool.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                  {activeTool.title}
                </h3>
                <p className="text-xs text-stone-500">
                  {activeTool.description}
                </p>
              </div>
            </div>

            {currentResult && (
              <button
                onClick={handleCopyContent}
                className={`px-3 py-1.5 text-xs font-medium rounded-xl flex items-center gap-1.5 transition ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Output'}</span>
              </button>
            )}
          </div>

          {/* Context Options for specific tools */}
          {selectedToolId === 'toast_speech' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-stone-50 dark:bg-stone-850 rounded-2xl text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-stone-700 dark:text-stone-300">Speech Speaker</label>
                <select
                  value={toastSpeaker}
                  onChange={(e) => setToastSpeaker(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-800 dark:text-stone-200"
                >
                  <option value="Maid of Honor">Maid of Honor</option>
                  <option value="Best Man">Best Man</option>
                  <option value="Parents of Bride/Groom">Parents</option>
                  <option value="Host / Birthday Honoree">Host / Honoree</option>
                  <option value="Community Chair / Keynote">Community Keynote Speaker</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-stone-700 dark:text-stone-300">Tone & Style</label>
                <select
                  value={toastTone}
                  onChange={(e) => setToastTone(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-800 dark:text-stone-200"
                >
                  <option value="Heartfelt with gentle humor">Heartfelt with Gentle Humor</option>
                  <option value="Sentimental and tear-jerker">Deeply Sentimental & Emotional</option>
                  <option value="High-energy roast and laugh-out-loud">High-Energy & Humorous Roast</option>
                  <option value="Poetic and classic heirloom">Poetic & Classic</option>
                </select>
              </div>
            </div>
          )}

          {selectedToolId === 'disaster_doctor' && (
            <div className="p-3.5 bg-stone-50 dark:bg-stone-850 rounded-2xl text-xs space-y-1">
              <label className="font-semibold text-stone-700 dark:text-stone-300">Crisis Scenario to Diagnose</label>
              <input
                type="text"
                value={crisisInput}
                onChange={(e) => setCrisisInput(e.target.value)}
                placeholder="e.g. Sudden thunderstorm, primary caterer canceled, power outage..."
                className="w-full px-3 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg text-stone-800 dark:text-stone-200"
              />
            </div>
          )}

          {/* Generated Result Container */}
          <div className="min-h-[320px] rounded-2xl bg-stone-50/50 dark:bg-stone-850/50 border border-stone-200/80 dark:border-stone-800 p-5 overflow-y-auto max-h-[550px]">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center animate-bounce">
                  <Wand2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                    Generating Tailored {activeTool.title}...
                  </h4>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Grounded in {plan.details.guestCount} guests in {plan.details.city}
                  </p>
                </div>
              </div>
            ) : currentResult ? (
              <div className="prose prose-stone dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed space-y-3">
                {/* Parse Markdown-like structure */}
                {currentResult.split('\n\n').map((block, idx) => {
                  if (block.startsWith('### ')) {
                    return (
                      <h3 key={idx} className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 mt-4 first:mt-0">
                        {block.replace('### ', '')}
                      </h3>
                    );
                  }
                  if (block.startsWith('#### ')) {
                    return (
                      <h4 key={idx} className="font-semibold text-sm text-stone-800 dark:text-stone-200 mt-3">
                        {block.replace('#### ', '')}
                      </h4>
                    );
                  }
                  if (block.startsWith('> [!TIP]') || block.startsWith('> [!NOTE]')) {
                    return (
                      <div key={idx} className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200">
                        {block.replace(/> \[[!A-Z]+\]\n/, '')}
                      </div>
                    );
                  }
                  if (block.startsWith('```')) {
                    const cleanCode = block.replace(/```[a-z]*\n?/g, '');
                    return (
                      <div key={idx} className="relative group p-3 bg-stone-900 text-stone-100 rounded-xl font-mono text-xs overflow-x-auto">
                        <pre className="whitespace-pre-wrap">{cleanCode}</pre>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(cleanCode);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          }}
                          className="absolute top-2 right-2 px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-[10px] text-white flex items-center gap-1 opacity-80 group-hover:opacity-100"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy WhatsApp Text</span>
                        </button>
                      </div>
                    );
                  }
                  return (
                    <p key={idx} className="text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line">
                      {block}
                    </p>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
                <activeTool.icon className="w-10 h-10 text-stone-300 dark:text-stone-700" />
                <div>
                  <h4 className="text-sm font-semibold text-stone-700 dark:text-stone-300">
                    No generation cached for {activeTool.title} yet
                  </h4>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Click "Generate {activeTool.title}" above to create a bespoke output!
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
