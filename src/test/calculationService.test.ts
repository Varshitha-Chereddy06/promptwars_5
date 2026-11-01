import { describe, it, expect } from 'vitest';
import {
  calculateDueDate,
  isMilestoneOverdue,
  calculateCountdown,
  calculateAllocations,
  calculatePlanHealth,
  calculateGuestSensitivity,
  formatCurrency,
  formatDateInputValue
} from '../services/calculationService';
import { BudgetCategory, Milestone, Vendor, Guest } from '../types';

describe('CalculationService', () => {
  describe('calculateDueDate', () => {
    it('accurately counts backwards from the event date', () => {
      const eventDate = '2026-12-31';
      // 30 days before Dec 31 is Dec 1
      expect(calculateDueDate(eventDate, 30)).toBe('2026-12-01');
      // 365 days before 2026-12-31 is 2025-12-31
      expect(calculateDueDate(eventDate, 365)).toBe('2025-12-31');
    });

    it('returns empty string for invalid date inputs', () => {
      expect(calculateDueDate('', 30)).toBe('');
      expect(calculateDueDate('invalid-date', 30)).toBe('');
      expect(calculateDueDate('2026-02-30', 30)).toBe('');
      expect(calculateDueDate('2026-12-31', Number.NaN)).toBe('');
      expect(calculateDueDate('2026-12-31', 1.5)).toBe('');
    });

    it('calculates leap-day deadlines without timezone-dependent date shifts', () => {
      expect(calculateDueDate('2024-03-01', 1)).toBe('2024-02-29');
    });
  });

  describe('isMilestoneOverdue', () => {
    it('flags true if due date is in the past and status is not completed', () => {
      const pastDate = '2020-01-01';
      expect(isMilestoneOverdue(pastDate, 'pending')).toBe(true);
      expect(isMilestoneOverdue(pastDate, 'in_progress')).toBe(true);
    });

    it('returns false if milestone is completed even if due date is in the past', () => {
      const pastDate = '2020-01-01';
      expect(isMilestoneOverdue(pastDate, 'completed')).toBe(false);
    });

    it('returns false for future due dates', () => {
      const futureDate = '2099-01-01';
      expect(isMilestoneOverdue(futureDate, 'pending')).toBe(false);
    });
  });

  describe('calculateCountdown', () => {
    it('calculates remaining time for future dates', () => {
      const futureDate = '2099-01-01';
      const countdown = calculateCountdown(futureDate, '18:00');
      expect(countdown.isPast).toBe(false);
      expect(countdown.days).toBeGreaterThan(100);
    });

    it('flags isPast true for dates in the past', () => {
      const pastDate = '2020-01-01';
      const countdown = calculateCountdown(pastDate, '12:00');
      expect(countdown.isPast).toBe(true);
      expect(countdown.totalSeconds).toBe(0);
    });

    it('returns a safe empty countdown for invalid dates and times', () => {
      expect(calculateCountdown('2026-02-30', '12:00').totalSeconds).toBe(0);
      expect(calculateCountdown('2099-01-01', '25:00').totalSeconds).toBe(0);
    });
  });

  describe('calculateAllocations', () => {
    it('distributes total budget according to category percentages', () => {
      const categories: BudgetCategory[] = [
        { id: '1', name: 'Venue', percentage: 50, allocatedAmount: 0, spentAmount: 0, iconName: '', color: '', notes: '' },
        { id: '2', name: 'Catering', percentage: 30, allocatedAmount: 0, spentAmount: 0, iconName: '', color: '', notes: '' },
        { id: '3', name: 'Buffer', percentage: 20, allocatedAmount: 0, spentAmount: 0, iconName: '', color: '', notes: '' }
      ];

      const recalculated = calculateAllocations(10000, categories);
      expect(recalculated[0].allocatedAmount).toBe(5000);
      expect(recalculated[1].allocatedAmount).toBe(3000);
      expect(recalculated[2].allocatedAmount).toBe(2000);
    });
  });

  describe('calculatePlanHealth', () => {
    it('computes 0-100 score and detects over-budget issues', () => {
      const categories: BudgetCategory[] = [
        { id: '1', name: 'Venue', percentage: 50, allocatedAmount: 5000, spentAmount: 6500, iconName: '', color: '', notes: '' },
        { id: '2', name: 'Contingency Buffer', percentage: 20, allocatedAmount: 2000, spentAmount: 1800, iconName: '', color: '', notes: '' }
      ];
      const milestones: Milestone[] = [
        { id: 'm1', title: 'Late task', daysBeforeEvent: 100, calculatedDueDate: '2020-01-01', category: 'General', status: 'pending', assignee: 'Host' }
      ];
      const vendors: Vendor[] = [];
      const guests: Guest[] = [];

      const health = calculatePlanHealth(categories, milestones, vendors, guests, 7000);
      expect(health.score).toBeGreaterThanOrEqual(0);
      expect(health.score).toBeLessThanOrEqual(100);
      expect(health.issues.length).toBeGreaterThan(0);
      expect(health.recommendations.length).toBeGreaterThan(0);
    });
  });

  describe('calculateGuestSensitivity', () => {
    it('accurately models +20 guests surge impact on catering and buffer', () => {
      const categories: BudgetCategory[] = [
        { id: '1', name: 'Catering, Bar & Service', percentage: 40, allocatedAmount: 16000, spentAmount: 0, iconName: '', color: '', notes: '' },
        { id: '2', name: 'Contingency Buffer', percentage: 10, allocatedAmount: 4000, spentAmount: 0, iconName: '', color: '', notes: '' }
      ];

      const sensitivity = calculateGuestSensitivity(100, 40000, categories, 'wedding');
      expect(sensitivity.baseCostPerGuest).toBe(400); // 40000 / 100
      expect(sensitivity.surgeGuests).toBe(20);
      expect(sensitivity.cateringSurgeAmount).toBeGreaterThan(0);
      expect(sensitivity.projectedCostPerGuest).toBeDefined();
    });
  });

  describe('formatCurrency', () => {
    it('formats numbers into clean currency strings', () => {
      expect(formatCurrency(5000)).toContain('5,000');
    });

    describe('formatDateInputValue', () => {
      it('formats the local calendar date without converting through UTC', () => {
        expect(formatDateInputValue(new Date(2026, 0, 2, 23, 30))).toBe('2026-01-02');
      });
    });
  });
});
