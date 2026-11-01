import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Navbar } from '../components/layout/Navbar';
import { CountdownTimer } from '../components/overview/CountdownTimer';
import { HealthScoreGauge } from '../components/overview/HealthScoreGauge';
import { GuestSensitivityCard } from '../components/overview/GuestSensitivityCard';
import { HowToUseModal } from '../components/common/HowToUseModal';
import { ShareModal } from '../components/common/ShareModal';
import { TabNavigation } from '../components/layout/TabNavigation';
import { createInitialPlan } from '../services/storageService';

describe('UI Components', () => {
  it('renders Navbar with an accessible event type switcher and health badge', () => {
    const healthMetrics = {
      score: 88,
      rating: 'excellent' as const,
      budgetHealthScore: 28,
      timelineHealthScore: 26,
      vendorHealthScore: 18,
      rsvpHealthScore: 16,
      issues: [],
      recommendations: []
    };

    render(
      <Navbar
        currentType="wedding"
        onSelectType={vi.fn()}
        healthMetrics={healthMetrics}
        hasApiKey={false}
        onOpenApiKeyModal={vi.fn()}
        onOpenShareModal={vi.fn()}
        onOpenHelpModal={vi.fn()}
        onToggleAIChat={vi.fn()}
        isAIChatOpen={false}
      />
    );

    expect(screen.getByText('Soirée')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Wedding/ })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /Birthday/ })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: /Community/ })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByText('How to Use')).toBeInTheDocument();
  });

  it('marks the active planning section as the current page', () => {
    const onSelectTab = vi.fn();
    render(
      <TabNavigation
        activeTab="overview"
        onSelectTab={onSelectTab}
        overdueCount={2}
        overBudgetCount={1}
        pendingRsvpCount={3}
      />
    );

    expect(screen.getByRole('button', { name: /Overview/ })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: /Budget/ })).not.toHaveAttribute('aria-current');
    expect(screen.getByRole('button', { name: /Budget/ })).toHaveTextContent('1');
    expect(screen.getByRole('button', { name: /Timeline/ })).toHaveTextContent('2');
    expect(screen.getByRole('button', { name: /RSVP & Diets/ })).toHaveTextContent('3');

    screen.getByRole('button', { name: /Budget/ }).click();
    expect(onSelectTab).toHaveBeenCalledWith('budget');
  });

  it('selects the share link and announces manual copy when clipboard access fails', async () => {
    const clipboardDescriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
    const writeText = vi.fn().mockRejectedValue(new Error('Clipboard unavailable'));
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText }
    });
    const selectSpy = vi.spyOn(HTMLInputElement.prototype, 'select').mockImplementation(() => undefined);

    try {
      render(<ShareModal isOpen={true} onClose={vi.fn()} plan={createInitialPlan('wedding')} />);
      fireEvent.click(screen.getByRole('button', { name: 'Copy link to clipboard' }));

      expect(await screen.findByRole('status')).toHaveTextContent(
        'Automatic copy is unavailable. The link is selected for you to copy manually.'
      );
      expect(selectSpy).toHaveBeenCalled();
      expect(writeText).toHaveBeenCalledWith(expect.stringContaining('#plan='));
    } finally {
      selectSpy.mockRestore();
      if (clipboardDescriptor) {
        Object.defineProperty(navigator, 'clipboard', clipboardDescriptor);
      } else {
        Reflect.deleteProperty(navigator, 'clipboard');
      }
    }
  });

  it('renders CountdownTimer with location details', () => {
    render(
      <CountdownTimer
        eventDate="2028-10-15"
        eventTime="17:00"
        city="Charleston, SC"
        venueName="Magnolia Estate"
      />
    );

    expect(screen.getByText('Event Countdown')).toBeInTheDocument();
    expect(screen.getByText(/Charleston, SC/)).toBeInTheDocument();
  });

  it('renders HealthScoreGauge with score and breakdown bars', () => {
    const metrics = {
      score: 75,
      rating: 'good' as const,
      budgetHealthScore: 24,
      timelineHealthScore: 22,
      vendorHealthScore: 15,
      rsvpHealthScore: 14,
      issues: ['One category over budget'],
      recommendations: ['Check catering quotes']
    };

    render(<HealthScoreGauge metrics={metrics} />);
    expect(screen.getByText('75')).toBeInTheDocument();
    expect(screen.getByText('Budget Discipline')).toBeInTheDocument();
    expect(screen.getByText('One category over budget')).toBeInTheDocument();
  });

  it('renders GuestSensitivityCard with slider and surge calculation', () => {
    const sensitivity = {
      baseCostPerGuest: 350,
      currentCostPerGuest: 120,
      surgeGuests: 20,
      projectedCostPerGuest: 330,
      projectedTotalSpend: 38000,
      cateringSurgeAmount: 3200,
      capacityWarning: false,
      budgetDeficitRisk: false
    };

    render(
      <GuestSensitivityCard
        guestCount={120}
        totalBudget={35000}
        onGuestCountChange={vi.fn()}
        sensitivity={sensitivity}
      />
    );

    expect(screen.getByText('120')).toBeInTheDocument();
    expect(screen.getByText('What If +20 Guests?')).toBeInTheDocument();
  });

  it('renders HowToUseModal with step-by-step instructions', () => {
    render(
      <HowToUseModal
        isOpen={true}
        onClose={vi.fn()}
        onNavigateToTab={vi.fn()}
      />
    );

    expect(screen.getByText('How to Use Soirée')).toBeInTheDocument();
    expect(screen.getByText('Step-by-Step Guide')).toBeInTheDocument();
    expect(screen.getByText('Pick Your Event Type Persona')).toBeInTheDocument();
  });
});
