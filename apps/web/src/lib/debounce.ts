export function debounceAsync<F extends (...args: any[]) => Promise<any>>(fn: F, delay: number) {
  let timer: NodeJS.Timeout | null;
  let pending: Promise<any> | null;

  return (...args: Parameters<F>): Promise<ReturnType<F>> => {
    if (timer)
      clearTimeout(timer);
    if (pending)
      pending = null;

    return new Promise((resolve) => {
      timer = setTimeout(() => {
        pending = fn(...args).then(resolve);
      }, delay);
    }) as Promise<ReturnType<F>>;
  };
}

export function debounceSync<F extends (...args: any[]) => any>(fn: F, delay: number) {
  let timer: NodeJS.Timeout | null;

  return (...args: Parameters<F>): void => {
    if (timer)
      clearTimeout(timer);

    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
