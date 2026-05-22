const LOG_LEVELS = ['debug', 'info', 'warn', 'error'] as const;
export type LogLevel = (typeof LOG_LEVELS)[number];

function getLogLevel(): LogLevel {
  const env = process.env.LOG_LEVEL?.toLowerCase();
  if (env && LOG_LEVELS.includes(env as LogLevel)) {
    return env as LogLevel;
  }
  return process.env.NODE_ENV === 'production' ? 'info' : 'debug';
}

function formatMeta(meta: unknown) {
  if (meta === undefined || meta === null) {
    return '';
  }
  if (typeof meta === 'string') {
    return meta;
  }
  try {
    return JSON.stringify(meta, Object.getOwnPropertyNames(meta), 2);
  } catch {
    return String(meta);
  }
}

function log(level: LogLevel, message: string, meta?: unknown) {
  const currentLevel = getLogLevel();
  if (LOG_LEVELS.indexOf(level) < LOG_LEVELS.indexOf(currentLevel)) {
    return;
  }

  const timestamp = new Date().toISOString();
  const correlationId = process.env.REQUEST_CORRELATION_ID || '';
  const prefix = correlationId ? `[${correlationId}]` : '';
  const details = formatMeta(meta);
  const output = details ? `${timestamp} ${prefix} ${message} ${details}` : `${timestamp} ${prefix} ${message}`;

  switch (level) {
    case 'debug':
      console.debug(output);
      break;
    case 'info':
      console.info(output);
      break;
    case 'warn':
      console.warn(output);
      break;
    case 'error':
      console.error(output);
      break;
  }
}

export const logger = {
  debug: (message: string, meta?: unknown) => log('debug', message, meta),
  info: (message: string, meta?: unknown) => log('info', message, meta),
  warn: (message: string, meta?: unknown) => log('warn', message, meta),
  error: (message: string, meta?: unknown) => log('error', message, meta),
};

export function createCorrelationId() {
  return `corr_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}
