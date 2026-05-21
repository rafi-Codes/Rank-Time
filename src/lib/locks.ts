type ReleaseLock = () => void;

declare global {
  // eslint-disable-next-line no-var
  var _lockQueues: Map<string, Promise<void>> | undefined;
}

const lockQueues = global._lockQueues ?? new Map<string, Promise<void>>();
global._lockQueues = lockQueues;

export async function acquireLock(key: string): Promise<ReleaseLock> {
  const previous = lockQueues.get(key) ?? Promise.resolve();
  let releaseCurrent!: ReleaseLock;
  const current = new Promise<void>((resolve) => {
    releaseCurrent = resolve;
  });
  const next = previous.then(() => current);

  lockQueues.set(key, next);
  await previous;

  return () => {
    releaseCurrent();
    if (lockQueues.get(key) === next) {
      lockQueues.delete(key);
    }
  };
}
