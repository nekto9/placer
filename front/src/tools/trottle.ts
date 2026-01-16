export const throttle = <T extends (...args: unknown[]) => void>(
  func: T,
  limit: number
) => {
  let lastCall = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= limit) {
      func(...args);
      lastCall = now;
    }
  };
};
