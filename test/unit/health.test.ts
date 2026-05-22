import { describe, expect, it, beforeEach, jest } from '@jest/globals';

jest.mock('@/lib/db', () => ({
  isDbHealthy: jest.fn(),
}));

jest.mock('@/lib/openRouterClient', () => ({
  getOpenRouterHealth: jest.fn(),
}));

jest.mock('@/lib/emailQueue', () => ({
  getEmailQueueHealth: jest.fn(),
  getEmailQueueStatus: jest.fn(),
}));

const dbMock: any = jest.requireMock('@/lib/db');
const openRouterClientMock: any = jest.requireMock('@/lib/openRouterClient');
const emailQueueMock: any = jest.requireMock('@/lib/emailQueue');

const healthRoute = require('@/app/api/health/route');
const openRouterRoute = require('@/app/api/health/openrouter/route');
const emailQueueRoute = require('@/app/api/health/email-queue/route');

describe('Health API routes', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns 200 when all services are healthy', async () => {
    dbMock.isDbHealthy.mockResolvedValue({ ok: true, state: 1 });
    openRouterClientMock.getOpenRouterHealth.mockResolvedValue({ healthy: true, provider: 'openrouter', message: 'ok', circuitOpen: false });
    emailQueueMock.getEmailQueueHealth.mockResolvedValue({ healthy: true, message: 'ok' });

    const response = await healthRoute.GET();
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data.db.ok).toBe(true);
    expect(body.data.openRouter.healthy).toBe(true);
    expect(body.data.email.healthy).toBe(true);
  });

  it('returns 503 when a service is degraded', async () => {
    dbMock.isDbHealthy.mockResolvedValue({ ok: false, error: 'db down', state: 0 });
    openRouterClientMock.getOpenRouterHealth.mockResolvedValue({ healthy: true, provider: 'openrouter', message: 'ok', circuitOpen: false });
    emailQueueMock.getEmailQueueHealth.mockResolvedValue({ healthy: true, message: 'ok' });

    const response = await healthRoute.GET();
    expect(response.status).toBe(503);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('SYSTEM_HEALTH_CHECK_FAILED');
  });
});

describe('OpenRouter health route', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns 200 when OpenRouter is healthy', async () => {
    openRouterClientMock.getOpenRouterHealth.mockResolvedValue({ healthy: true, provider: 'openrouter', message: 'ok', circuitOpen: false });

    const response = await openRouterRoute.GET();
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data.healthy).toBe(true);
  });

  it('returns 503 when OpenRouter is degraded', async () => {
    openRouterClientMock.getOpenRouterHealth.mockResolvedValue({ healthy: false, provider: 'openrouter', message: 'circuit open', circuitOpen: true });

    const response = await openRouterRoute.GET();
    expect(response.status).toBe(503);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('OPENROUTER_HEALTH_CHECK_FAILED');
  });
});

describe('Email queue health route', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns 200 when email queue status is healthy', async () => {
    emailQueueMock.getEmailQueueStatus.mockResolvedValue({
      healthy: true,
      message: 'ok',
      activeJobs: 0,
      waitingJobs: 0,
      completedJobs: 0,
      failedJobs: 0,
      delayedJobs: 0,
    });

    const response = await emailQueueRoute.GET();
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.data.healthy).toBe(true);
  });

  it('returns 503 when email queue status is unhealthy', async () => {
    emailQueueMock.getEmailQueueStatus.mockResolvedValue({
      healthy: false,
      message: 'failed',
      activeJobs: 0,
      waitingJobs: 0,
      completedJobs: 0,
      failedJobs: 0,
      delayedJobs: 0,
    });

    const response = await emailQueueRoute.GET();
    expect(response.status).toBe(503);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('EMAIL_QUEUE_STATUS_FAILED');
  });
});
