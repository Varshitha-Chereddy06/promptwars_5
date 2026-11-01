import React, { useState, useEffect } from 'react';
import { EventType, FullEventPlan, MilestoneStatus, ExpenseItem, Vendor, Guest, Table, MoodboardTheme, AIToolResult } from './types';
import { loadPlan, savePlan, getRuntimeApiKey, decodeSharedPlanFromUrl, createInitialPlan } from './services/storageService';
import { calculatePlanHealth, calculateGuestSensitivity, calculateAllocations } from './services/calculationService';
import { Navbar } from './components/layout/Navbar';
import { TabNavigation, ActiveTabId } from './components/layout/TabNavigation';
import { OverviewTab } from './components/overview/OverviewTab';
import { BudgetTab } from './components/budget/BudgetTab';
import { TimelineTab } from './components/timeline/TimelineTab';
import { VendorsTab } from './components/vendors/VendorsTab';
import { RSVPTab } from './components/rsvp/RSVPTab';
import { SeatingChartTab } from './components/seating/SeatingChartTab';
import { MoodboardTab } from './components/moodboard/MoodboardTab';
import { AIStudioTab } from './components/ai/AIStudioTab';
import { AICoPilotDrawer } from './components/ai/AICoPilotDrawer';
import { ApiKeyModal } from './components/common/ApiKeyModal';
import { ShareModal } from './components/common/ShareModal';
import { HowToUseModal } from './components/common/HowToUseModal';

export const App: React.FC = () => {
  // Check for shared URL plan or initialize wedding
  const [currentType, setCurrentType] = useState<EventType>(() => {
    const shared = decodeSharedPlanFromUrl();
    return shared?.details?.type || 'wedding';
  });

  const [plan, setPlan] = useState<FullEventPlan>(() => {
    const shared = decodeSharedPlanFromUrl();
    if (shared) return shared;
    return loadPlan('wedding');
  });

  const [activeTab, setActiveTab] = useState<ActiveTabId>('overview');
  const [selectedAIToolId, setSelectedAIToolId] = useState<string>('theme_studio');
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isHowToUseModalOpen, setIsHowToUseModalOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(() => Boolean(getRuntimeApiKey()));

  // Auto-save whenever plan changes
  useEffect(() => {
    savePlan(plan);
  }, [plan]);

  // Refresh API key status
  const handleKeyUpdated = () => {
    setHasApiKey(Boolean(getRuntimeApiKey()));
  };

  // Switch Event Type
  const handleSelectEventType = (type: EventType) => {
    if (type === currentType) return;
    setCurrentType(type);
    const newPlan = loadPlan(type);
    setPlan(newPlan);
  };

  // Real-time calculations
  const healthMetrics = calculatePlanHealth(
    plan.categories,
    plan.milestones,
    plan.vendors,
    plan.guests,
    plan.details.totalBudget
  );

  const sensitivity = calculateGuestSensitivity(
    plan.details.guestCount,
    plan.details.totalBudget,
    plan.categories,
    plan.details.type
  );

  // Update Event Details
  const handleUpdateDetails = (updated: Partial<FullEventPlan['details']>) => {
    setPlan(prev => {
      const newDetails = { ...prev.details, ...updated };
      let newCategories = prev.categories;

      // If budget changed, recalculate allocated amounts
      if (updated.totalBudget !== undefined && updated.totalBudget !== prev.details.totalBudget) {
        newCategories = calculateAllocations(updated.totalBudget, prev.categories);
      }

      return {
        ...prev,
        details: newDetails,
        categories: newCategories
      };
    });
  };

  // Add Expense
  const handleAddExpense = (expenseData: Omit<ExpenseItem, 'id'>) => {
    const newExpense: ExpenseItem = {
      ...expenseData,
      id: `exp-${Date.now()}`
    };

    setPlan(prev => {
      const updatedCategories = prev.categories.map(c => {
        if (c.id === expenseData.categoryId) {
          return { ...c, spentAmount: (c.spentAmount || 0) + expenseData.amount };
        }
        return c;
      });

      return {
        ...prev,
        categories: updatedCategories,
        expenses: [newExpense, ...prev.expenses]
      };
    });
  };

  // Milestone Status
  const handleUpdateMilestoneStatus = (id: string, status: MilestoneStatus) => {
    setPlan(prev => ({
      ...prev,
      milestones: prev.milestones.map(m => m.id === id ? { ...m, status } : m)
    }));
  };

  // Add Milestone
  const handleAddMilestone = (milestoneData: Omit<FullEventPlan['milestones'][0], 'id'>) => {
    const newMilestone = {
      ...milestoneData,
      id: `m-custom-${Date.now()}`
    };
    setPlan(prev => ({
      ...prev,
      milestones: [...prev.milestones, newMilestone]
    }));
  };

  // Vendor actions
  const handleUpdateVendor = (vendor: Vendor) => {
    setPlan(prev => ({
      ...prev,
      vendors: prev.vendors.map(v => v.id === vendor.id ? vendor : v)
    }));
  };

  const handleAddVendor = (vendorData: Omit<Vendor, 'id'>) => {
    const newVendor: Vendor = {
      ...vendorData,
      id: `v-custom-${Date.now()}`
    };
    setPlan(prev => ({
      ...prev,
      vendors: [...prev.vendors, newVendor]
    }));
  };

  // Guest actions
  const handleUpdateGuest = (guest: Guest) => {
    setPlan(prev => ({
      ...prev,
      guests: prev.guests.map(g => g.id === guest.id ? guest : g)
    }));
  };

  const handleAddGuest = (guestData: Omit<Guest, 'id'>) => {
    const newGuest: Guest = {
      ...guestData,
      id: `g-custom-${Date.now()}`
    };
    setPlan(prev => ({
      ...prev,
      guests: [...prev.guests, newGuest]
    }));
  };

  // Table actions
  const handleUpdateTables = (tables: Table[]) => {
    setPlan(prev => ({ ...prev, tables }));
  };

  // Theme action
  const handleSelectTheme = (theme: MoodboardTheme) => {
    setPlan(prev => ({ ...prev, activeTheme: theme }));
  };

  // AI Output save
  const handleSaveAIOutput = (toolId: string, result: AIToolResult) => {
    setPlan(prev => ({
      ...prev,
      aiSavedOutputs: {
        ...prev.aiSavedOutputs,
        [toolId]: result
      }
    }));
  };

  // Count badges for navigation tabs
  const overdueCount = plan.milestones.filter(m => {
    if (m.status === 'completed' || !m.calculatedDueDate) return false;
    const due = new Date(m.calculatedDueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return due.getTime() < today.getTime();
  }).length;

  const overBudgetCount = plan.categories.filter(c => c.spentAmount > c.allocatedAmount && c.allocatedAmount > 0).length;
  const pendingRsvpCount = plan.guests.filter(g => g.rsvpStatus === 'pending').length;

  return (
    <div className="planner-app min-h-screen flex flex-col bg-stone-50/70 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans transition-colors">
      
      {/* Top Navigation */}
      <Navbar
        currentType={currentType}
        onSelectType={handleSelectEventType}
        healthMetrics={healthMetrics}
        hasApiKey={hasApiKey}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onOpenHelpModal={() => setIsHowToUseModalOpen(true)}
        onToggleAIChat={() => setIsAIChatOpen(prev => !prev)}
        isAIChatOpen={isAIChatOpen}
      />

      {/* Main Feature Tabs */}
      <TabNavigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        overdueCount={overdueCount}
        overBudgetCount={overBudgetCount}
        pendingRsvpCount={pendingRsvpCount}
      />

      {/* Body Content */}
      <main className="planner-main flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'overview' && (
          <OverviewTab
            plan={plan}
            healthMetrics={healthMetrics}
            sensitivity={sensitivity}
            onUpdateDetails={handleUpdateDetails}
          />
        )}

        {activeTab === 'budget' && (
          <BudgetTab
            categories={plan.categories}
            totalBudget={plan.details.totalBudget}
            onAddExpense={handleAddExpense}
            onTriggerAIBudgetHacker={() => {
              setSelectedAIToolId('budget_hacker');
              setActiveTab('ai_studio');
            }}
          />
        )}

        {activeTab === 'timeline' && (
          <TimelineTab
            milestones={plan.milestones}
            eventDate={plan.details.date}
            onUpdateMilestoneStatus={handleUpdateMilestoneStatus}
            onAddMilestone={handleAddMilestone}
            onTriggerAITimeline={() => {
              setSelectedAIToolId('run_of_show');
              setActiveTab('ai_studio');
            }}
          />
        )}

        {activeTab === 'vendors' && (
          <VendorsTab
            vendors={plan.vendors}
            onUpdateVendor={handleUpdateVendor}
            onAddVendor={handleAddVendor}
          />
        )}

        {activeTab === 'rsvp' && (
          <RSVPTab
            guests={plan.guests}
            onUpdateGuest={handleUpdateGuest}
            onAddGuest={handleAddGuest}
            onDraftAIReminder={() => {
              setSelectedAIToolId('invite_writer');
              setActiveTab('ai_studio');
            }}
          />
        )}

        {activeTab === 'seating' && (
          <SeatingChartTab
            tables={plan.tables}
            guests={plan.guests}
            onUpdateTables={handleUpdateTables}
          />
        )}

        {activeTab === 'moodboard' && (
          <MoodboardTab
            activeTheme={plan.activeTheme}
            onSelectTheme={handleSelectTheme}
            onTriggerAIThemeStudio={() => {
              setSelectedAIToolId('theme_studio');
              setActiveTab('ai_studio');
            }}
          />
        )}

        {activeTab === 'ai_studio' && (
          <AIStudioTab
            plan={plan}
            initialToolId={selectedAIToolId}
            onSaveAIOutput={handleSaveAIOutput}
          />
        )}
      </main>

      {/* Floating or Docked Conversational Co-Pilot Drawer */}
      <AICoPilotDrawer
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        plan={plan}
        onUpdatePlan={setPlan}
      />

      {/* Modals */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeyUpdated={handleKeyUpdated}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        plan={plan}
      />

      <HowToUseModal
        isOpen={isHowToUseModalOpen}
        onClose={() => setIsHowToUseModalOpen(false)}
        onNavigateToTab={(tab) => setActiveTab(tab)}
      />

      {/* Footer */}
      <footer className="planner-footer border-t border-stone-200/80 dark:border-stone-800 bg-white/50 dark:bg-stone-900/50 py-6 mt-12 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-stone-800 dark:text-stone-200">Soirée</span>
            <span>— GenAI Planning Assistant for Weddings, Birthdays & Community Events</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Plans stay in this browser unless shared or sent to live AI</span>
            <span>•</span>
            <button
              onClick={() => {
                if (window.confirm('Reset this event plan back to default presets?')) {
                  const initial = createInitialPlan(currentType);
                  setPlan(initial);
                }
              }}
              className="text-stone-400 hover:text-rose-600 transition underline"
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
};
