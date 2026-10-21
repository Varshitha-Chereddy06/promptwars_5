import { describe, it, expect } from 'vitest';
import { executeAITool } from '../services/aiService';
import { createInitialPlan } from '../services/storageService';

describe('AIService', () => {
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
});
