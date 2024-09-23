export function factorial(n: number): number {
  if (n < 0) {
    throw new Error("Negative numbers not supported");
  }
  if (n == 0) {
    return 1;
  }
  return n * factorial(n - 1);
}

export function initFactorialUi(component: HTMLElement) {
  component.innerHTML = `Factorial value <code>5!</code> is <code>${factorial(5)}</code>.`;
}
