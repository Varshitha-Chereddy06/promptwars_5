import React from 'react';
import { LayoutDashboard, Wallet, CalendarClock, Store, Users, Armchair, Palette, Wand2 } from 'lucide-react';

export type ActiveTabId = 'overview' | 'budget' | 'timeline' | 'vendors' | 'rsvp' | 'seating' | 'moodboard' | 'ai_studio';

interface TabNavigationProps {
  activeTab: ActiveTabId;
  onSelectTab: (tab: ActiveTabId) => void;
  overdueCount: number;
  overBudgetCount: number;
  pendingRsvpCount: number;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onSelectTab,
  overdueCount,
  overBudgetCount,
  pendingRsvpCount
}) => {
  const tabs = [
    { id: 'overview' as ActiveTabId, label: 'Overview', icon: LayoutDashboard },
    { id: 'budget' as ActiveTabId, label: 'Budget', icon: Wallet, badge: overBudgetCount > 0 ? `${overBudgetCount}` : undefined, badgeColor: 'bg-red-500' },
    { id: 'timeline' as ActiveTabId, label: 'Timeline', icon: CalendarClock, badge: overdueCount > 0 ? `${overdueCount}` : undefined, badgeColor: 'bg-rose-500' },
    { id: 'vendors' as ActiveTabId, label: 'Vendors & Quotes', icon: Store },
    { id: 'rsvp' as ActiveTabId, label: 'RSVP & Diets', icon: Users, badge: pendingRsvpCount > 0 ? `${pendingRsvpCount}` : undefined, badgeColor: 'bg-amber-500' },
    { id: 'seating' as ActiveTabId, label: 'Seating Chart', icon: Armchair },
    { id: 'moodboard' as ActiveTabId, label: 'Mood Board', icon: Palette },
    { id: 'ai_studio' as ActiveTabId, label: 'AI Studio (8 Tools)', icon: Wand2, highlight: true },
  ];

  return (
    <nav className="planner-nav border-b border-stone-200/80 dark:border-stone-800 bg-white/70 dark:bg-stone-900/70 backdrop-blur-sm sticky top-16 z-30 overflow-x-auto scrollbar-none" aria-label="Planning sections">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 sm:space-x-2 py-2.5 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => onSelectTab(tab.id)}
                className={`planner-nav-tab group relative flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all ${
                  isActive
                    ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900 shadow-sm font-semibold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800'
                } ${tab.highlight && !isActive ? 'text-rose-600 dark:text-rose-400 font-semibold' : ''}`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-rose-400 dark:text-rose-600' : tab.highlight ? 'text-rose-500' : 'text-stone-400 group-hover:text-stone-600'}`} />
                <span>{tab.label}</span>

                {tab.badge && (
                  <span className={`px-1.5 py-0.2 text-[10px] font-bold text-white rounded-full ${tab.badgeColor}`}>
                    {tab.badge}
                  </span>
                )}

                {tab.highlight && (
                  <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
