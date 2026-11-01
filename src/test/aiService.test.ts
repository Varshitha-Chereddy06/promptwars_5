import { beforeEach, describe, it, expect, vi } from 'vitest';
import { executeAITool } from '../services/aiService';
import {
  createInitialPlan,
  setAIProviderSettings,
  setRuntimeApiKey
} from '../services/storageService';

describe('AIService', () => {
  beforeEach(() => {
    localStorage.clear();
    setRuntimeApiKey('');
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('synthesizes high-fidelity offline responses for all 8 core tools', async () => {
    const plan = createInitialPlan('wedding');
    const tools = [
      'theme_studio',
      'run_of_show',
      'invite_writer',
      'toast_speech',
      'disaster_doctor',
      'budget_hacker',
      'surprise_moments',
      'sponsor_pitch'
    ];

    for (const toolId of tools) {
      const res = await executeAITool({ toolId, plan });
      expect(res).toBeDefined();
      expect(res.toolId).toBe(toolId);
      expect(res.content.length).toBeGreaterThan(50);
      expect(res.title).toBeDefined();
    }
  });

  it('embeds active event context like city and guest count into generated outputs', async () => {
    const plan = createInitialPlan('birthday');
    plan.details.city = 'Honolulu, HI';
    plan.details.guestCount = 85;

    const res = await executeAITool({ toolId: 'theme_studio', plan });
    expect(res.content).toContain('Honolulu, HI');
  });

  it('handles conversational co-pilot queries with event context', async () => {
    const plan = createInitialPlan('community');
    const res = await executeAITool({
      toolId: 'co_pilot_chat',
      plan,
      customPrompt: 'How can we increase volunteer signups?'
    });
    expect(res.content).toBeDefined();
    expect(res.content.length).toBeGreaterThan(30);
  });

  it('sends Gemini API keys in a header instead of the request URL', async () => {
    setRuntimeApiKey('test-gemini-api-key');
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: 'Gemini response' }] } }]
      })
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await executeAITool({
      toolId: 'theme_studio',
      plan: createInitialPlan('wedding')
    });

    expect(result.content).toBe('Gemini response');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).not.toContain('test-gemini-api-key');
    expect(options.headers['x-goog-api-key']).toBe('test-gemini-api-key');
  });

  it('does not send API keys to non-HTTPS OpenAI-compatible endpoints', async () => {
    setRuntimeApiKey('test-router-api-key');
    setAIProviderSettings({
      provider: 'openai-compatible',
      baseUrl: 'http://router.example/v1',
      model: 'planner-model'
    });
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    const result = await executeAITool({
      toolId: 'theme_studio',
      plan: createInitialPlan('wedding')
    });

    expect(result.content.length).toBeGreaterThan(50);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('uses the configured model and key with a valid HTTPS API router', async () => {
    setRuntimeApiKey('test-router-api-key');
    setAIProviderSettings({
      provider: 'openai-compatible',
      baseUrl: 'https://router.example/v1',
      model: 'planner-model'
    });
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'Router response' } }]
      })
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await executeAITool({
      toolId: 'theme_studio',
      plan: createInitialPlan('wedding')
    });

    expect(result.content).toBe('Router response');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://router.example/v1/chat/completions',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-router-api-key'
        }),
        body: expect.stringContaining('"model":"planner-model"')
      })
    );
  });
});
