import type { Job, Queue as BullQueue } from 'bull';
import { sendEmailNow } from './emailTransport';
import { getRedisClient } from './redisClient';
import { logger } from './logger';

const queueName = 'ranktime-email-queue';
let emailQueue: BullQueue<any> | null = null;

async function initQueue() {
  if (emailQueue) return emailQueue;
  const redis = getRedisClient();
  if (!redis) {
    logger.warn('Redis not configured; email queue is disabled. Falling back to direct send.');
    return null;
  }

  const { default: Queue } = await import('bull');
  emailQueue = new Queue(queueName, process.env.REDIS_URL as string);

  emailQueue.process(async (job: Job) => {
    const { to, subject, text, html } = job.data;
    return await sendEmailNow(to, subject, text, html);
  });

  emailQueue.on('failed', (job: Job, err: Error) => {
    logger.error('Email job failed', { jobId: job.id, error: err });
  });

  emailQueue.on('completed', (job: Job) => {
    logger.info('Email sent successfully through queue', { jobId: job.id });
  });

  return emailQueue;
}

export async function getEmailQueue() {
  return await initQueue();
}

export async function enqueueEmail(to: string, subject: string, text: string, html?: string) {
  const queue = await initQueue();
  if (!queue) {
    return await sendEmailNow(to, subject, text, html);
  }

  await queue.add(
    { to, subject, text, html },
    {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      removeOnComplete: true,
      removeOnFail: false,
      timeout: 30_000,
    }
  );
}

export async function getEmailQueueHealth() {
  const queue = await initQueue();
  if (!queue) {
    return { healthy: false, message: 'Redis email queue disabled' };
  }

  try {
    const client = queue.client;
    await client.ping();
    return { healthy: true, message: 'Email queue connected' };
  } catch (error) {
    return { healthy: false, message: 'Email queue connection failed', error };
  }
}

export async function getEmailQueueStatus() {
  const queue = await initQueue();
  if (!queue) {
    return {
      healthy: false,
      message: 'Redis email queue disabled',
      activeJobs: 0,
      waitingJobs: 0,
      completedJobs: 0,
      failedJobs: 0,
      delayedJobs: 0,
    };
  }

  try {
    const counts = await queue.getJobCounts();
    return {
      healthy: true,
      message: 'Email queue connected',
      activeJobs: counts?.active ?? 0,
      waitingJobs: counts?.waiting ?? 0,
      completedJobs: counts?.completed ?? 0,
      failedJobs: counts?.failed ?? 0,
      delayedJobs: counts?.delayed ?? 0,
    };
  } catch (error) {
    logger.error('Email queue status error', error);
    return {
      healthy: false,
      message: 'Unable to retrieve email queue status',
      activeJobs: 0,
      waitingJobs: 0,
      completedJobs: 0,
      failedJobs: 0,
      delayedJobs: 0,
      error,
    };
  }
}
