import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  createInitialPlan,
  loadPlan,
  savePlan,
  generateShareableUrl,
  decodeSharedPlanFromUrl,
  getAIProviderSettings,
  getRuntimeApiKey,
  setAIProviderSettings,
  setRuntimeApiKey
} from '../services/storageService';
import { PRESET_THEMES } from '../constants/presets';

describe('StorageService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
    window.location.hash = '';
    setRuntimeApiKey('');
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

  it('replaces malformed persisted plan data with a safe initial plan', () => {
    const plan = createInitialPlan('wedding');
    window.localStorage.setItem('soiree_event_plan_wedding', JSON.stringify({
      ...plan,
      categories: [null]
    }));
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    const loaded = loadPlan('wedding');

    expect(loaded.details.type).toBe('wedding');
    expect(loaded.categories.every(category => typeof category.name === 'string')).toBe(true);
    expect(warnSpy).toHaveBeenCalledWith(
      'Saved plan for wedding has an invalid shape; using a fresh plan.'
    );
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

  it('rejects shared plans containing malformed section data', () => {
    const invalidPayload = btoa(encodeURIComponent(JSON.stringify({
      d: createInitialPlan('wedding').details,
      c: [null]
    })));
    window.location.hash = `#plan=${invalidPayload}`;
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    expect(decodeSharedPlanFromUrl()).toBeNull();
    expect(warnSpy).toHaveBeenCalledWith(
      'Could not decode plan from URL hash',
      expect.any(Error)
    );
  });

  it('rejects oversized shared plan hashes before decoding', () => {
    window.location.hash = `#plan=${'a'.repeat(256_001)}`;
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    expect(decodeSharedPlanFromUrl()).toBeNull();
    expect(warnSpy).toHaveBeenCalledWith(
      'Could not decode plan from URL hash',
      expect.any(Error)
    );
  });

  it('keeps API keys in memory instead of persisting them in localStorage', () => {
    expect(getRuntimeApiKey()).toBe('');
    setRuntimeApiKey('AIzaSyTestKey123');
    expect(getRuntimeApiKey()).toBe('AIzaSyTestKey123');
    expect(window.localStorage.getItem('soiree_gemini_api_key')).toBeNull();
    setRuntimeApiKey('');
    expect(getRuntimeApiKey()).toBe('');
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
