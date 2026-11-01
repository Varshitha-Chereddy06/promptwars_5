import { BudgetCategory, Milestone, Vendor, Guest, PlanHealthMetrics, SensitivityAnalysis, EventType } from '../types';

function getCalendarDateParts(dateStr: string): [number, number, number] | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (!match) return null;

  const [year, month, day] = match.slice(1).map(Number);
  const validationDate = new Date(0);
  validationDate.setUTCFullYear(year, month - 1, day);
  validationDate.setUTCHours(0, 0, 0, 0);

  if (
    validationDate.getUTCFullYear() !== year ||
    validationDate.getUTCMonth() !== month - 1 ||
    validationDate.getUTCDate() !== day
  ) {
    return null;
  }

  return [year, month, day];
}

/**
 * Calculates calendar due date given an event date string and days before the event
 */
export function calculateDueDate(eventDateStr: string, daysBeforeEvent: number): string {
  const dateParts = getCalendarDateParts(eventDateStr);
  if (!dateParts || !Number.isInteger(daysBeforeEvent)) return '';

  const dueDate = new Date(0);
  dueDate.setUTCFullYear(dateParts[0], dateParts[1] - 1, dateParts[2]);
  dueDate.setUTCHours(0, 0, 0, 0);
  dueDate.setUTCDate(dueDate.getUTCDate() - daysBeforeEvent);

  const year = dueDate.getUTCFullYear();
  const month = String(dueDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(dueDate.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Checks if a milestone is overdue (due date before today and not completed)
 */
export function isMilestoneOverdue(dueDateStr: string, status: string): boolean {
  const dueDateParts = getCalendarDateParts(dueDateStr);
  if (status === 'completed' || !dueDateParts) return false;

  const today = new Date();
  const todayDate = new Date(0);
  todayDate.setUTCFullYear(today.getFullYear(), today.getMonth(), today.getDate());
  todayDate.setUTCHours(0, 0, 0, 0);
  const dueDate = new Date(0);
  dueDate.setUTCFullYear(dueDateParts[0], dueDateParts[1] - 1, dueDateParts[2]);
  dueDate.setUTCHours(0, 0, 0, 0);

  return dueDate.getTime() < todayDate.getTime();
}

/**
 * Calculates remaining days, hours, minutes until the event date and time
 */
export function calculateCountdown(eventDateStr: string, eventTimeStr: string = '17:00'): {
  totalSeconds: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
} {
  const dateParts = getCalendarDateParts(eventDateStr);
  const timeMatch = /^(\d{2}):(\d{2})$/.exec(eventTimeStr);
  const hour = timeMatch ? Number(timeMatch[1]) : NaN;
  const minute = timeMatch ? Number(timeMatch[2]) : NaN;
  if (!dateParts || hour < 0 || hour > 23 || minute < 0 || minute > 59 || !Number.isInteger(hour) || !Number.isInteger(minute)) {
    return { totalSeconds: 0, days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false };
  }

  const [year, month, day] = dateParts;
  const targetDate = new Date(year, month - 1, day, hour, minute, 0, 0);
  if (
    targetDate.getFullYear() !== year ||
    targetDate.getMonth() !== month - 1 ||
    targetDate.getDate() !== day ||
    targetDate.getHours() !== hour ||
    targetDate.getMinutes() !== minute
  ) {
    return { totalSeconds: 0, days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false };
  }

  const now = new Date();
  const diffMs = targetDate.getTime() - now.getTime();
  const isPast = diffMs <= 0;

  if (isPast) {
    return { totalSeconds: 0, days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const remHours = Math.floor((totalSeconds % 86400) / 3600);
  const remMinutes = Math.floor((totalSeconds % 3600) / 60);
  const remSeconds = totalSeconds % 60;

  return { totalSeconds, days, hours: remHours, minutes: remMinutes, seconds: remSeconds, isPast: false };
}

/**
 * Recalculates category allocations when total budget changes or percentages are adjusted
 */
export function calculateAllocations(totalBudget: number, categories: BudgetCategory[]): BudgetCategory[] {
  const safeBudget = Math.max(0, totalBudget);
  return categories.map(cat => ({
    ...cat,
    allocatedAmount: Math.round((safeBudget * (cat.percentage || 0)) / 100)
  }));
}

/**
 * Computes Plan Health Score (0 - 100) dynamically
 */
export function calculatePlanHealth(
  categories: BudgetCategory[],
  milestones: Milestone[],
  vendors: Vendor[],
  guests: Guest[],
  totalBudget: number
): PlanHealthMetrics {
  const issues: string[] = [];
  const recommendations: string[] = [];

  // 1. Budget Health (30 points maximum)
  let budgetScore = 30;
  const totalSpent = categories.reduce((sum, c) => sum + (c.spentAmount || 0), 0);
  const overBudgetCategories = categories.filter(c => c.spentAmount > c.allocatedAmount && c.allocatedAmount > 0);

  if (totalSpent > totalBudget && totalBudget > 0) {
    const overage = totalSpent - totalBudget;
    budgetScore = Math.max(0, 30 - Math.min(25, Math.round((overage / totalBudget) * 50)));
    issues.push(`Total spend exceeds event budget by ${formatCurrency(overage)}.`);
    recommendations.push('Run the AI Budget Hacker tool to find trimming opportunities.');
  } else if (overBudgetCategories.length > 0) {
    budgetScore -= overBudgetCategories.length * 3;
    issues.push(`${overBudgetCategories.length} budget categor${overBudgetCategories.length > 1 ? 'ies are' : 'y is'} exceeding allocated limits.`);
    recommendations.push(`Review actual spends in: ${overBudgetCategories.map(c => c.name).join(', ')}.`);
  }

  // Check contingency buffer
  const bufferCat = categories.find(c => c.name.toLowerCase().includes('contingency') || c.name.toLowerCase().includes('buffer'));
  if (bufferCat && bufferCat.spentAmount > bufferCat.allocatedAmount * 0.5) {
    budgetScore -= 4;
    issues.push('Over 50% of your emergency contingency buffer has been utilized.');
  }

  budgetScore = Math.max(0, Math.min(30, budgetScore));

  // 2. Timeline Health (30 points maximum)
  let timelineScore = 30;
  if (milestones.length > 0) {
    const overdueMilestones = milestones.filter(m => isMilestoneOverdue(m.calculatedDueDate, m.status));
    const completedCount = milestones.filter(m => m.status === 'completed').length;
    const completionRate = completedCount / milestones.length;

    if (overdueMilestones.length > 0) {
      const penalty = Math.min(20, overdueMilestones.length * 5);
      timelineScore -= penalty;
      issues.push(`${overdueMilestones.length} milestone${overdueMilestones.length > 1 ? 's are' : ' is'} overdue.`);
      recommendations.push(`Prioritize overdue tasks: ${overdueMilestones.slice(0, 2).map(m => `"${m.title}"`).join(', ')}.`);
    } else {
      // Reward completion
      timelineScore = Math.round(20 + completionRate * 10);
    }
  } else {
    timelineScore = 15;
    recommendations.push('Generate standard timeline milestones to stay on schedule.');
  }
  timelineScore = Math.max(0, Math.min(30, timelineScore));

  // 3. Vendor Health (20 points maximum)
  let vendorScore = 20;
  if (vendors.length > 0) {
    const hiredCount = vendors.filter(v => v.status === 'hired').length;
    const contactedCount = vendors.filter(v => v.status === 'contacted' || v.status === 'quote_received').length;
    const coverage = (hiredCount * 1.0 + contactedCount * 0.5) / vendors.length;

    vendorScore = Math.round(coverage * 20);
    if (hiredCount === 0 && contactedCount === 0) {
      issues.push('No vendors have been booked or contacted yet.');
      recommendations.push('Check the Vendor Checklist and start requesting quotes for venue and catering.');
    } else if (hiredCount < Math.ceil(vendors.length / 3)) {
      issues.push('Key vendor roles are still unhired.');
    }
  } else {
    vendorScore = 10;
  }
  vendorScore = Math.max(0, Math.min(20, vendorScore));

  // 4. RSVP Health (20 points maximum)
  let rsvpScore = 20;
  if (guests.length > 0) {
    const respondedCount = guests.filter(g => g.rsvpStatus !== 'pending').length;
    const responseRate = respondedCount / guests.length;
    rsvpScore = Math.round(responseRate * 20);

    const pendingCount = guests.filter(g => g.rsvpStatus === 'pending').length;
    if (pendingCount > 0 && responseRate < 0.6) {
      issues.push(`${pendingCount} guest${pendingCount > 1 ? 's have' : ' has'} not responded to RSVP.`);
      recommendations.push('Use the AI Multi-Tone Invite Writer to draft a WhatsApp RSVP reminder.');
    }
  } else {
    rsvpScore = 12; // neutral
  }
  rsvpScore = Math.max(0, Math.min(20, rsvpScore));

  const totalScore = Math.max(0, Math.min(100, budgetScore + timelineScore + vendorScore + rsvpScore));

  let rating: PlanHealthMetrics['rating'] = 'fair';
  if (totalScore >= 85) rating = 'excellent';
  else if (totalScore >= 70) rating = 'good';
  else if (totalScore >= 50) rating = 'fair';
  else rating = 'critical';

  return {
    score: totalScore,
    rating,
    budgetHealthScore: budgetScore,
    timelineHealthScore: timelineScore,
    vendorHealthScore: vendorScore,
    rsvpHealthScore: rsvpScore,
    issues,
    recommendations
  };
}

/**
 * Calculates guest sensitivity analysis ("What if +20 guests?")
 */
export function calculateGuestSensitivity(
  guestCount: number,
  totalBudget: number,
  categories: BudgetCategory[],
  eventType: EventType
): SensitivityAnalysis {
  const safeGuests = Math.max(1, guestCount);
  const baseCostPerGuest = Math.round(totalBudget / safeGuests);

  const totalSpent = categories.reduce((sum, c) => sum + (c.spentAmount || 0), 0);
  const currentCostPerGuest = Math.round(totalSpent / safeGuests);

  // Variable per-guest catering/hospitality percentage
  const cateringCat = categories.find(c =>
    c.name.toLowerCase().includes('catering') ||
    c.name.toLowerCase().includes('food') ||
    c.name.toLowerCase().includes('beverage')
  );

  const cateringPercent = cateringCat ? cateringCat.percentage / 100 : 0.35;
  const cateringBudget = totalBudget * cateringPercent;
  const costPerPlate = cateringBudget / safeGuests;

  const surgeGuests = 20;
  const newGuestCount = safeGuests + surgeGuests;
  const cateringSurgeAmount = Math.round(costPerPlate * surgeGuests);

  // Miscellaneous extra per guest (chair rental, favors, place settings ~ $15 each)
  const miscExtraPerGuest = eventType === 'wedding' ? 25 : eventType === 'birthday' ? 12 : 6;
  const extraMiscAmount = miscExtraPerGuest * surgeGuests;

  const projectedTotalSpend = totalBudget + cateringSurgeAmount + extraMiscAmount;
  const projectedCostPerGuest = Math.round(projectedTotalSpend / newGuestCount);

  // Check if buffer can absorb it
  const bufferCat = categories.find(c => c.name.toLowerCase().includes('buffer') || c.name.toLowerCase().includes('contingency'));
  const bufferAmount = bufferCat ? bufferCat.allocatedAmount : totalBudget * 0.1;
  const budgetDeficitRisk = (cateringSurgeAmount + extraMiscAmount) > bufferAmount;

  return {
    baseCostPerGuest,
    currentCostPerGuest,
    surgeGuests,
    projectedCostPerGuest,
    projectedTotalSpend,
    cateringSurgeAmount: cateringSurgeAmount + extraMiscAmount,
    capacityWarning: newGuestCount > (eventType === 'wedding' ? 250 : eventType === 'birthday' ? 100 : 500),
    budgetDeficitRisk
  };
}

/**
 * Currency formatter helper
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      maximumFractionDigits: 0
    }).format(amount || 0);
  } catch {
    return `$${Math.round(amount || 0).toLocaleString()}`;
  }
}

/**
 * Date formatter helper
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return 'TBD';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const [year, month, day] = parts.map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function formatDateInputValue(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
