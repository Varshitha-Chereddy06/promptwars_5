import { describe, it, expect, beforeEach } from 'vitest';
import {
  createInitialPlan,
  loadPlan,
  savePlan,
  generateShareableUrl,
  decodeSharedPlanFromUrl,
  getAIProviderSettings,
  getStoredApiKey,
  setAIProviderSettings,
  setStoredApiKey
} from '../services/storageService';
import { PRESET_THEMES } from '../constants/presets';

describe('StorageService', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.location.hash = '';
  });

  it('creates distinct initial plans for wedding, birthday, and community', () => {
    const weddingPlan = createInitialPlan('wedding');
    const birthdayPlan = createInitialPlan('birthday');
    const communityPlan = createInitialPlan('community');

    expect(weddingPlan.details.type).toBe('wedding');
    expect(birthdayPlan.details.type).toBe('birthday');
    expect(communityPlan.details.type).toBe('community');

    expect(weddingPlan.categories.length).toBeGreaterThan(0);
    expect(weddingPlan.milestones.length).toBeGreaterThan(0);
    expect(weddingPlan.vendors.length).toBeGreaterThan(0);
  });

  it('persists and retrieves plan from localStorage', () => {
    const plan = createInitialPlan('birthday');
    plan.details.title = 'Test 40th Birthday';
    savePlan(plan);

    const loaded = loadPlan('birthday');
    expect(loaded.details.title).toBe('Test 40th Birthday');
  });

  it('round-trips the shared event, budget expenses, milestones, vendors, and selected theme', () => {
    const plan = createInitialPlan('wedding');
    plan.expenses.push({
      id: 'expense-shared',
      categoryId: plan.categories[0].id,
      name: 'Final venue payment',
      amount: 1250,
      date: '2026-10-30',
      paidTo: 'Magnolia Estate'
    });
    plan.activeTheme = PRESET_THEMES[1];
    const url = generateShareableUrl(plan);
    expect(url).toContain('#plan=');

    window.location.hash = new URL(url).hash;
    const sharedPlan = decodeSharedPlanFromUrl();

    expect(sharedPlan?.details).toEqual(plan.details);
    expect(sharedPlan?.categories).toEqual(plan.categories);
    expect(sharedPlan?.expenses).toEqual(plan.expenses);
    expect(sharedPlan?.milestones).toEqual(plan.milestones);
    expect(sharedPlan?.vendors).toEqual(plan.vendors);
    expect(sharedPlan?.activeTheme).toEqual(plan.activeTheme);
  });

  it('ignores a shared plan with an unsupported event type', () => {
    const invalidPayload = btoa(encodeURIComponent(JSON.stringify({
      d: { type: 'unsupported-event' }
    })));
    window.location.hash = `#plan=${invalidPayload}`;

    expect(decodeSharedPlanFromUrl()).toBeNull();
  });

  it('safely stores and removes API keys in localStorage', () => {
    expect(getStoredApiKey()).toBe('');
    setStoredApiKey('AIzaSyTestKey123');
    expect(getStoredApiKey()).toBe('AIzaSyTestKey123');
    setStoredApiKey('');
    expect(getStoredApiKey()).toBe('');
  });

  it('stores the selected live AI provider settings', () => {
    expect(getAIProviderSettings().provider).toBe('gemini');
    setAIProviderSettings({
      provider: 'openai-compatible',
      baseUrl: 'https://router.example/v1',
      model: 'planner-model'
    });

    expect(getAIProviderSettings()).toEqual({
      provider: 'openai-compatible',
      baseUrl: 'https://router.example/v1',
      model: 'planner-model'
    });
  });
});
