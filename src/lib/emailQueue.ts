import { logger } from '@/lib/logger';
import { retryWithBackoff } from '@/lib/resilience';

type EmailJob = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

export type EmailSender = (to: string, subject: string, text: string, html?: string) => Promise<unknown>;

export async function sendEmailWithRetry(job: EmailJob, sender: EmailSender) {
  const startedAt = Date.now();
  try {
    const result = await retryWithBackoff(
      () => sender(job.to, job.subject, job.text, job.html),
      {
        retries: 2,
        baseDelayMs: 1000,
        jitterMs: 200,
        timeoutMs: 15000,
      }
    );
    logger.info('Email sent', {
      to: job.to,
      subject: job.subject,
      durationMs: Date.now() - startedAt,
    });
    return result;
  } catch (error) {
    logger.error('Email delivery failed after retries', {
      to: job.to,
      subject: job.subject,
      durationMs: Date.now() - startedAt,
      error,
    });
    throw error;
  }
}
