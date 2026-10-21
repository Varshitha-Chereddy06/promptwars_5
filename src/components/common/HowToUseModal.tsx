import React, { useState } from 'react';
import {
  HelpCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Wallet,
  Clock,
  Store,
  Users,
  Armchair,
  Palette,
  Wand2,
  Share2,
  Sliders,
  List
} from 'lucide-react';
import { ActiveTabId } from '../layout/TabNavigation';

interface HowToUseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab: (tab: ActiveTabId) => void;
}

export const HowToUseModal: React.FC<HowToUseModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTab
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [viewMode, setViewMode] = useState<'step_by_step' | 'all_steps'>('step_by_step');

  if (!isOpen) return null;

  const steps = [
    {
      id: 1,
      badge: 'Step 1: Vertical Selection',
      title: 'Pick Your Event Type Persona',
      tabId: 'overview' as ActiveTabId,
      tabLabel: 'Event Switcher in Navbar',
      icon: Sparkles,
      iconColor: 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-300',
      description: 'Soirée adapts its entire brain to your event type. Click the switcher at the top of the navigation bar to pick your persona:',
      bullets: [
        '💍 Wedding: Loads a 46% venue/catering split, 13-step reverse timeline from T-365 days, and bridal/vendor checklists.',
        '🎂 Milestone Birthday: Loads a private venue & cocktail split, 8-week party timeline, DJ/audio and 360-booth checklist.',
        '🤝 Community Gathering: Loads municipal permits, stage production, safety/sanitation, and corporate sponsor outreach.'
      ],
      tip: 'Switching event types seamlessly retains each plan in your browser with independent budgets and settings!'
    },
    {
      id: 2,
      badge: 'Step 2: Event Overview',
      title: 'Enter Date, Location & Target Budget',
      tabId: 'overview' as ActiveTabId,
      tabLabel: 'Overview Tab',
      icon: Calendar,
      iconColor: 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-300',
      description: 'Head to the Overview tab to customize your baseline event parameters:',
      bullets: [
        'Click "Edit Details" to set your Event Title, Host / Honoree Names, Date & Time, City, and Venue.',
        'Choose your Aesthetic Vibe preset or type your own custom atmosphere concept.',
        'Watch the live ticking countdown update automatically down to the second!'
      ],
      tip: 'The Plan Health Score (0–100) will constantly evaluate your readiness based on budget health, overdue tasks, and vendor coverage.'
    },
    {
      id: 3,
      badge: 'Step 3: Sensitivity Analysis',
      title: 'Test Guest Count Economics & "+20 Guests"',
      tabId: 'overview' as ActiveTabId,
      tabLabel: 'Overview Tab (Guest Slider)',
      icon: Sliders,
      iconColor: 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-300',
      description: 'Guest headcounts directly drive your biggest expenses. Use the interactive Guest Slider on the Overview page to stress-test your finances:',
      bullets: [
        'Drag the Guest Slider (10 to 500 guests) to see instant cost-per-guest updates.',
        'Review the "+20 Guests Surge Impact" box to see how much extra food, beverage, and chair rentals will cost if extra guests RSVP.',
        'Check the Deficit Alert: it warns you if the surge would exhaust your emergency buffer.'
      ],
      tip: 'Always ensure your Contingency Buffer can absorb at least 15-20 unexpected RSVPs before finalizing venue contracts.'
    },
    {
      id: 4,
      badge: 'Step 4: Budget Discipline',
      title: 'Track Category Caps & Log Actual Spend',
      tabId: 'budget' as ActiveTabId,
      tabLabel: 'Budget Tab',
      icon: Wallet,
      iconColor: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300',
      description: 'Soirée automatically calculates dollar allocations based on your event vertical percentages:',
      bullets: [
        'Review category caps: Progress bars are green when healthy, turning amber at 85% and bright RED when over budget.',
        'Click "+ Log Spend" to record actual vendor payments, deposits, and receipts with payee details.',
        'Click the "AI Budget Hacker" button anytime to receive 5 targeted cost-saving negotiation hacks.'
      ],
      tip: 'Keep your Contingency & Buffer intact as long as possible to maintain a 90+ Plan Health Score.'
    },
    {
      id: 5,
      badge: 'Step 5: Reverse Timeline',
      title: 'Manage Milestones & Eliminate Overdue Tasks',
      tabId: 'timeline' as ActiveTabId,
      tabLabel: 'Timeline Tab',
      icon: Clock,
      iconColor: 'bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-300',
      description: 'Unlike standard calendars, Soirée schedules deadlines backwards from your target celebration date:',
      bullets: [
        'Every milestone shows its exact calendar deadline (e.g. T - 90d, T - 30d, Day-of).',
        'Tasks with past deadlines that are not completed are automatically flagged with a pulsating red "OVERDUE" badge.',
        'Filter by "Overdue" or "Due Soon (Next 14d)" to focus on immediate bottlenecks, or click "+ Add Milestone" for custom tasks.'
      ],
      tip: 'Checking off overdue milestones immediately boosts your Plan Health Score!'
    },
    {
      id: 6,
      badge: 'Step 6: Vendor Directory',
      title: 'Track Quotes, Deposits & Compare Matrix',
      tabId: 'vendors' as ActiveTabId,
      tabLabel: 'Vendors Tab',
      icon: Store,
      iconColor: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-300',
      description: 'Keep all vendor communications, contracts, and quotes organized in one place:',
      bullets: [
        'Track hiring status: Researching → Contacted → Quote Received → Hired & Confirmed.',
        'Record quoted prices vs. deposits paid to monitor outstanding contract balances.',
        'Click "Compare Quotes" on any vendor card to launch the Quote Comparison Matrix, evaluating competing proposals side-by-side with AI recommendations.'
      ],
      tip: 'Use the 5-star rating system to remember your favorite portfolio options during tastings.'
    },
    {
      id: 7,
      badge: 'Step 7: Guest RSVPs',
      title: 'Track RSVPs, Plus-Ones & Dietary Allergies',
      tabId: 'rsvp' as ActiveTabId,
      tabLabel: 'RSVP Tab',
      icon: Users,
      iconColor: 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-300',
      description: 'Manage headcounts, meal selections, and special accommodations:',
      bullets: [
        'Filter guests by Confirmed, Pending, and Declined with total headcount breakdown (including plus-ones).',
        'Automatic dietary tally: Instantly see exact counts for Vegan, Vegetarian, Gluten-Free, Halal, Kosher, and Nut Allergies for your caterer.',
        'Click "AI RSVP Reminder" to draft a friendly, high-converting WhatsApp message to pending guests.'
      ],
      tip: 'Accurate dietary counts help you avoid costly day-of meal surprises with your banquet kitchen!'
    },
    {
      id: 8,
      badge: 'Step 8: Seating Chart',
      title: 'Build Interactive Table Seating Arrangements',
      tabId: 'seating' as ActiveTabId,
      tabLabel: 'Seating Chart Tab',
      icon: Armchair,
      iconColor: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300',
      description: 'Create floor plans and seat guests with zero stress:',
      bullets: [
        'Add Round tables (8 seats), Rectangular banquet tables (10 seats), or VIP Head tables.',
        'Select any table and click "Seat Here →" from the Unassigned Guests drawer to place confirmed guests.',
        'Monitor table capacities and review dietary badges shown directly at the table so servers know who needs special meals.'
      ],
      tip: 'The seating builder flags tables that are over capacity so you can rebalance seating smoothly.'
    },
    {
      id: 9,
      badge: 'Step 9: AI Studio & Co-Pilot',
      title: 'Run 8 Tailored AI Tools + Conversational Chat',
      tabId: 'ai_studio' as ActiveTabId,
      tabLabel: 'AI Studio Tab',
      icon: Wand2,
      iconColor: 'bg-pink-100 text-pink-600 dark:bg-pink-950 dark:text-pink-300',
      description: 'Harness Soirée’s dual-engine AI (Google Gemini API + local offline engine) for personalized planning:',
      bullets: [
        'Theme Studio: Generates aesthetic concepts with interactive hex color swatches.',
        'Run-of-Show: Minute-by-minute operational itinerary from morning load-in to midnight send-off.',
        'Multi-Tone Invites: Formal, Warm, Playful suites + 1-click WhatsApp text ready to send.',
        'Toast & Speech Crafter: Speeches for Maid of Honor, Best Man, Host, or Keynote with humor sliders.',
        'Disaster Doctor: 3-tier contingency plan (Plan A/B/C) for sudden rain, delayed caterers, or power outages.',
        'Budget Hacker, Surprise Moments & Sponsor Pitch for complete event excellence.',
        'AI Co-Pilot: Click "AI Co-Pilot" in the navbar anytime to chat interactively with your event planner!'
      ],
      tip: 'Want live Gemini 1.5 Flash? Click the Key icon in the navbar to add your free Google AI Studio key!'
    },
    {
      id: 10,
      badge: 'Step 10: Share & Export',
      title: 'Collaborate with Co-Hosts & Backup Your Plan',
      tabId: 'overview' as ActiveTabId,
      tabLabel: 'Share Button in Navbar',
      icon: Share2,
      iconColor: 'bg-teal-100 text-teal-600 dark:bg-teal-950 dark:text-teal-300',
      description: 'Your plan is 100% private to your browser, but easily shared whenever you need:',
      bullets: [
        'Click "Share" in the navbar to generate an Instant Shareable URL Hash.',
        'Send the link to co-planners, your fiancé, family, or committee members—it loads your exact plan in their browser without any database account required.',
        'Download an offline backup anytime by clicking "Export Raw Plan (.json)".'
      ],
      tip: 'You can test opening your share link in an incognito window to verify how co-planners see your plan!'
    }
  ];

  const current = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleJumpToTab = (tabId: ActiveTabId) => {
    onNavigateToTab(tabId);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="how-to-use-title"
    >
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-900/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-500 text-white rounded-2xl shadow-sm shadow-rose-500/20">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="how-to-use-title" className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                  How to Use Soirée
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                  Step-by-Step Guide
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Master your event budget, reverse timeline, vendors, and GenAI studio
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center p-1 bg-stone-100 dark:bg-stone-800 rounded-xl text-xs">
              <button
                onClick={() => setViewMode('step_by_step')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                  viewMode === 'step_by_step'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                Wizard
              </button>
              <button
                onClick={() => setViewMode('all_steps')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition flex items-center gap-1 ${
                  viewMode === 'all_steps'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">All Steps</span>
              </button>
            </div>

            <button
              onClick={onClose}
              aria-label="Close guide"
              className="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar (Wizard Mode) */}
        {viewMode === 'step_by_step' && (
          <div className="w-full bg-stone-100 dark:bg-stone-800 h-1.5">
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-300 ease-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {viewMode === 'step_by_step' ? (
            /* Wizard Mode Single Step Card */
            <div className="space-y-6 animate-fade-in">
              {/* Step Badge & Indicator */}
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/60">
                  {current.badge}
                </span>
                <span className="text-xs font-mono font-semibold text-stone-400">
                  {currentStep + 1} of {steps.length}
                </span>
              </div>

              {/* Title & Icon Header */}
              <div className="flex items-start gap-4">
                <div className={`p-3.5 rounded-2xl flex-shrink-0 ${current.iconColor}`}>
                  <current.icon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
                    {current.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">
                    {current.description}
                  </p>
                </div>
              </div>

              {/* Bullet Points */}
              <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200/70 dark:border-stone-800 space-y-2.5">
                {current.bullets.map((bullet, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>

              {/* Pro Tip Box */}
              <div className="p-3.5 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-2xl text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold">Planner Tip: </strong>
                  <span>{current.tip}</span>
                </div>
              </div>

              {/* Quick Jump to Relevant Tab */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-stone-500">
                  Ready to test this feature?
                </span>
                <button
                  onClick={() => handleJumpToTab(current.tabId)}
                  className="px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950 hover:bg-rose-100 rounded-xl flex items-center gap-1.5 transition"
                >
                  <span>Go to {current.tabLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* All Steps Cheat Sheet Mode */
            <div className="space-y-6">
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-2xl text-xs text-rose-800 dark:text-rose-300">
                <strong>Quick Reference Guide:</strong> Follow these 10 steps to plan your wedding, milestone birthday, or community gathering from start to finish!
              </div>

              <div className="divide-y divide-stone-100 dark:divide-stone-800 space-y-4">
                {steps.map((st, i) => (
                  <div key={st.id} className="pt-4 first:pt-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                          #{st.id}
                        </span>
                        <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                          {st.title}
                        </h4>
                      </div>
                      <button
                        onClick={() => handleJumpToTab(st.tabId)}
                        className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1"
                      >
                        <span>Open {st.tabLabel}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    <p className="text-xs text-stone-600 dark:text-stone-400">
                      {st.description}
                    </p>

                    <ul className="text-xs text-stone-500 dark:text-stone-400 space-y-1 pl-4 list-disc">
                      {st.bullets.map((b, bi) => (
                        <li key={bi}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50">
          {viewMode === 'step_by_step' ? (
            <>
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="px-4 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 disabled:opacity-30 rounded-xl flex items-center gap-1.5 transition"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              {/* Step Dots Indicator */}
              <div className="hidden sm:flex items-center gap-1.5">
                {steps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentStep(idx)}
                    title={`Jump to Step ${idx + 1}`}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      currentStep === idx
                        ? 'w-6 bg-rose-600'
                        : 'bg-stone-300 dark:bg-stone-700 hover:bg-stone-400'
                    }`}
                  />
                ))}
              </div>

              {currentStep < steps.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="px-5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm flex items-center gap-1.5 transition"
                >
                  <span>Next Step</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm flex items-center gap-1.5 transition"
                >
                  <span>Ready to Plan! ✓</span>
                </button>
              )}
            </>
          ) : (
            <div className="w-full flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 rounded-xl transition"
              >
                Close Guide
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
