import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Navbar } from '../components/layout/Navbar';
import { CountdownTimer } from '../components/overview/CountdownTimer';
import { HealthScoreGauge } from '../components/overview/HealthScoreGauge';
import { GuestSensitivityCard } from '../components/overview/GuestSensitivityCard';

describe('UI Components', () => {
  it('renders Navbar with event type switcher and health badge', () => {
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
        onToggleAIChat={vi.fn()}
        isAIChatOpen={false}
      />
    );

    expect(screen.getByText('Soirée')).toBeInTheDocument();
    expect(screen.getByText('Wedding')).toBeInTheDocument();
    expect(screen.getByText('Birthday')).toBeInTheDocument();
    expect(screen.getByText('Community')).toBeInTheDocument();
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
});
