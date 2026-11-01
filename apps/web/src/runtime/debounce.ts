export interface Debounced<TArgs extends unknown[]> {
  (...args: TArgs): void;
  cancel: () => void;
}

export function debounce<TArgs extends unknown[]>(
  run: (...args: TArgs) => void,
  delayMs: number,
): Debounced<TArgs> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const debounced = (...args: TArgs) => {
    clearTimeout(timer);
    timer = setTimeout(() => run(...args), delayMs);
  };
  debounced.cancel = () => clearTimeout(timer);
  return debounced;
}
