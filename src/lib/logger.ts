type LogContext = Record<string, unknown>;

function serializeError(error: unknown) {
  if (!(error instanceof Error)) {
    return error;
  }

  return {
    name: error.name,
    message: error.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : error.stack,
  };
}

function writeLog(level: 'info' | 'warn' | 'error', message: string, context: LogContext = {}) {
  const payload = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...context,
    error: context.error ? serializeError(context.error) : undefined,
  };

  const line = JSON.stringify(payload);
  if (level === 'error') {
    console.error(line);
  } else if (level === 'warn') {
    console.warn(line);
  } else {
    console.log(line);
  }
}

export const logger = {
  info: (message: string, context?: LogContext) => writeLog('info', message, context),
  warn: (message: string, context?: LogContext) => writeLog('warn', message, context),
  error: (message: string, context?: LogContext) => writeLog('error', message, context),
};
