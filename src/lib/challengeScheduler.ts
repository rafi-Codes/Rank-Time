import { connectToDatabase } from './db';
import User from '@/models/User';
import { generateChallengesForUser } from './challenges';

// Schedule helper: compute ms until next occurrence of hour:minute
function msUntilNext(hour: number, minute = 0) {
  const now = new Date();
  const next = new Date(now);
  next.setHours(hour, minute, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);
  return next.getTime() - now.getTime();
}

async function runDailyGeneration() {
  try {
    await connectToDatabase();
    const users = await User.find({}).select('_id');
    for (const u of users) {
      try {
        await generateChallengesForUser(u._id, { daily: true, weekly: false });
      } catch (e) {
        console.error('Error generating daily challenges for user', u._id, e);
      }
    }
    console.log('Daily challenge generation complete');
  } catch (error) {
    console.error('Scheduler error (daily):', error);
  }
}

async function runWeeklyGeneration() {
  try {
    await connectToDatabase();
    const users = await User.find({}).select('_id');
    for (const u of users) {
      try {
        await generateChallengesForUser(u._id, { daily: false, weekly: true });
      } catch (e) {
        console.error('Error generating weekly challenges for user', u._id, e);
      }
    }
    console.log('Weekly challenge generation complete');
  } catch (error) {
    console.error('Scheduler error (weekly):', error);
  }
}

// Initialize scheduler: schedule daily at 00:05 and weekly on Sunday 00:10
export function initChallengeScheduler() {
  try {
    // Daily at 00:05
    const msToDaily = msUntilNext(0, 5);
    setTimeout(() => {
      runDailyGeneration();
      setInterval(runDailyGeneration, 24 * 60 * 60 * 1000);
    }, msToDaily);

    // Weekly on Sunday 00:10 - compute days until next Sunday
    const now = new Date();
    const daysUntilSunday = (7 - now.getDay()) % 7;
    const nextSunday = new Date(now);
    nextSunday.setDate(now.getDate() + daysUntilSunday);
    nextSunday.setHours(0, 10, 0, 0);
    let msToWeekly = nextSunday.getTime() - now.getTime();
    if (msToWeekly <= 0) msToWeekly += 7 * 24 * 60 * 60 * 1000;

    setTimeout(() => {
      runWeeklyGeneration();
      setInterval(runWeeklyGeneration, 7 * 24 * 60 * 60 * 1000);
    }, msToWeekly);

    console.log('Challenge scheduler initialized');
  } catch (error) {
    console.error('Error initializing challenge scheduler:', error);
  }
}
