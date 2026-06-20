/**
 * Unit tests for the AI Coach API route handler.
 * All external Groq SDK calls are mocked.
 */

import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';

// ─────────────────────────────────────────────
// Mock Groq SDK using a proper class mock
// ─────────────────────────────────────────────
const mockCreate = vi.fn();

vi.mock('groq-sdk', () => {
  const MockGroq = vi.fn().mockImplementation(function (this: any) {
    this.chat = {
      completions: {
        create: mockCreate,
      },
    };
  });
  return { default: MockGroq };
});

// Mock NextResponse
vi.mock('next/server', () => ({
  NextResponse: {
    json: (data: unknown, init?: ResponseInit) => ({
      data,
      status: init?.status ?? 200,
    }),
  },
}));

// ─────────────────────────────────────────────
// Helper to build a fake Request
// ─────────────────────────────────────────────
function makeRequest(body: object): Request {
  return {
    json: async () => body,
  } as unknown as Request;
}

const VALID_USER_CONTEXT = {
  name: 'Test User',
  level: 3,
  xp: 250,
  streak: 5,
  todayCO2: 4.5,
  totalCO2Saved: 12.3,
  diet: 'vegetarian',
  transport: 'public',
  energySource: 'solar',
};

// ─────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────
describe('POST /api/ai-coach', () => {
  let POST: (req: Request) => Promise<any>;

  beforeEach(async () => {
    vi.resetModules();
    // Re-import after reset so the mock applies cleanly
    const mod = await import('@/app/api/ai-coach/route');
    POST = mod.POST;
  });

  afterEach(() => {
    vi.clearAllMocks();
    delete process.env.GROQ_API_KEY;
  });

  it('returns isConfigured: false when no API key is set and message is ping', async () => {
    const req = makeRequest({ message: 'ping', customApiKey: '', userContext: {}, chatHistory: [] });
    const res = await POST(req) as any;
    expect(res.data.isConfigured).toBe(false);
    expect(res.data.content).toBe('NO_API_KEY_CONFIGURED');
  });

  it('returns a fallback response for normal messages with no API key', async () => {
    const req = makeRequest({
      message: 'Tell me about carbon',
      customApiKey: '',
      userContext: VALID_USER_CONTEXT,
      chatHistory: [],
    });
    const res = await POST(req) as any;
    expect(res.data.content).toBeTruthy();
    expect(res.data.isConfigured).toBe(false);
  });

  it('returns isConfigured: true when ping succeeds with a valid key', async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: 'pong' } }],
    });
    const req = makeRequest({
      message: 'ping',
      customApiKey: 'gsk_valid_key',
      userContext: {},
      chatHistory: [],
    });
    const res = await POST(req) as any;
    expect(res.data.isConfigured).toBe(true);
  });

  it('returns isConfigured: false when ping fails due to invalid key', async () => {
    mockCreate.mockRejectedValueOnce(new Error('Invalid API Key'));
    const req = makeRequest({
      message: 'ping',
      customApiKey: 'gsk_invalid_key',
      userContext: {},
      chatHistory: [],
    });
    const res = await POST(req) as any;
    expect(res.data.isConfigured).toBe(false);
  });

  it('returns AI reply for a normal message with valid key', async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: 'Try cycling to work to save CO2!' } }],
    });
    const req = makeRequest({
      message: 'How can I reduce my transport emissions?',
      customApiKey: 'gsk_valid_key',
      userContext: VALID_USER_CONTEXT,
      chatHistory: [],
    });
    const res = await POST(req) as any;
    expect(res.data.content).toBe('Try cycling to work to save CO2!');
  });

  it('uses env GROQ_API_KEY when no customApiKey is provided', async () => {
    process.env.GROQ_API_KEY = 'gsk_env_key';
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: 'pong' } }],
    });
    const req = makeRequest({
      message: 'ping',
      customApiKey: '',
      userContext: {},
      chatHistory: [],
    });
    const res = await POST(req) as any;
    expect(res.data.isConfigured).toBe(true);
  });

  it('returns a safe fallback message on API error', async () => {
    mockCreate.mockRejectedValueOnce(new Error('Rate limit exceeded'));
    const req = makeRequest({
      message: 'What should I eat to reduce my footprint?',
      customApiKey: 'gsk_valid_key',
      userContext: VALID_USER_CONTEXT,
      chatHistory: [],
    });
    const res = await POST(req) as any;
    expect(res.data.content).toBeTruthy();
    expect(res.status).toBe(200);
  });

  it('limits chat history to last 6 messages sent to the model', async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: 'Great question!' } }],
    });
    const longHistory = Array.from({ length: 20 }, (_, i) => ({
      role: i % 2 === 0 ? 'user' : 'assistant',
      content: `Message ${i}`,
    }));
    const req = makeRequest({
      message: 'New question',
      customApiKey: 'gsk_valid_key',
      userContext: VALID_USER_CONTEXT,
      chatHistory: longHistory,
    });
    await POST(req);
    expect(mockCreate).toHaveBeenCalledOnce();
    const callArgs = mockCreate.mock.calls[0][0];
    // system + up to 6 history + 1 new user message = max 8 messages
    expect(callArgs.messages.length).toBeLessThanOrEqual(8);
  });
});
