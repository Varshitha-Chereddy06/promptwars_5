export type EventType = 'wedding' | 'birthday' | 'community';

export type PlanHealthRating = 'critical' | 'fair' | 'good' | 'excellent';

export interface EventDetails {
  id: string;
  type: EventType;
  title: string;
  hostNames: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  city: string;
  venueName: string;
  vibe: string;
  totalBudget: number;
  guestCount: number;
  currency: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  percentage: number; // e.g. 46
  allocatedAmount: number;
  spentAmount: number;
  iconName: string;
  color: string;
  notes: string;
}

export interface ExpenseItem {
  id: string;
  categoryId: string;
  name: string;
  amount: number;
  date: string;
  paidTo: string;
  receiptUrl?: string;
}

export type MilestoneStatus = 'pending' | 'in_progress' | 'completed';

export interface Milestone {
  id: string;
  title: string;
  daysBeforeEvent: number; // e.g. 90 = 90 days before event date
  calculatedDueDate: string; // YYYY-MM-DD
  category: string;
  status: MilestoneStatus;
  assignee: string;
  isOverdue?: boolean;
  notes?: string;
}

export type VendorStatus = 'researching' | 'contacted' | 'quote_received' | 'hired' | 'declined';

export interface Vendor {
  id: string;
  category: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  status: VendorStatus;
  quotedAmount: number;
  depositPaid: number;
  rating: number; // 1-5
  notes: string;
  quoteOptions?: VendorQuoteOption[];
}

export interface VendorQuoteOption {
  id: string;
  vendorName: string;
  quotedPrice: number;
  packageDetails: string;
  pros: string;
  cons: string;
  isRecommended?: boolean;
}

export type RSVPStatus = 'confirmed' | 'declined' | 'pending';
export type DietaryOption = 'none' | 'vegan' | 'vegetarian' | 'gluten_free' | 'dairy_free' | 'halal' | 'kosher' | 'nut_allergy';

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  group: string; // e.g. Bride Family, Groom Family, VIP, Committee, General
  rsvpStatus: RSVPStatus;
  plusOnes: number;
  dietary: DietaryOption;
  dietaryDetails?: string;
  mealChoice?: string;
  tableId?: string;
  seatNumber?: number;
  notes?: string;
}

export type TableShape = 'round' | 'rectangular' | 'head';

export interface Table {
  id: string;
  name: string;
  shape: TableShape;
  capacity: number;
  x: number;
  y: number;
  guestIds: string[];
}

export interface PaletteColor {
  hex: string;
  name: string;
  role: 'primary' | 'secondary' | 'accent' | 'neutral' | 'highlight';
}

export interface MoodboardTheme {
  id: string;
  name: string;
  description: string;
  palette: PaletteColor[];
  fontPairing: {
    heading: string;
    body: string;
  };
  decorElements: string[];
  stylingKeywords: string[];
}

export interface PlanHealthMetrics {
  score: number; // 0 - 100
  rating: PlanHealthRating;
  budgetHealthScore: number;
  timelineHealthScore: number;
  vendorHealthScore: number;
  rsvpHealthScore: number;
  issues: string[];
  recommendations: string[];
}

export interface SensitivityAnalysis {
  baseCostPerGuest: number;
  currentCostPerGuest: number;
  surgeGuests: number; // default +20
  projectedCostPerGuest: number;
  projectedTotalSpend: number;
  cateringSurgeAmount: number;
  capacityWarning: boolean;
  budgetDeficitRisk: boolean;
}

export interface AIToolResult {
  toolId: string;
  title: string;
  content: string;
  generatedAt: string;
  meta?: Record<string, unknown>;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  actionSuggested?: {
    type: 'add_expense' | 'add_milestone' | 'adjust_budget';
    payload: any;
  };
}

export interface FullEventPlan {
  details: EventDetails;
  categories: BudgetCategory[];
  expenses: ExpenseItem[];
  milestones: Milestone[];
  vendors: Vendor[];
  guests: Guest[];
  tables: Table[];
  activeTheme?: MoodboardTheme;
  aiSavedOutputs: Record<string, AIToolResult>;
  chatHistory: ChatMessage[];
}
