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

describe('StorageService', () => {
  beforeEach(() => {
    window.localStorage.clear();
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

  it('generates a shareable URL containing base64 encoded state', () => {
    const plan = createInitialPlan('wedding');
    const url = generateShareableUrl(plan);
    expect(url).toContain('#plan=');
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
