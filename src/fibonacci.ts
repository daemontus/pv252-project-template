export function fibonacci(i: number): number {
  if (i < 0) {
    throw new Error("Cannot compute on negative numbers");
  }
  if (i == 0) {
    return 0;
  }
  if (i == 1) {
    return 1;
  }
  return fibonacci(i - 1) + fibonacci(i - 2);
}

export function initFibonacciUi(component: HTMLElement) {
  component.innerHTML = `5th fibonacci number is <code>${fibonacci(5)}</code>`;
}
