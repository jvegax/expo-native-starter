/** Throws when a condition that should always hold does not. Use for programmer errors, not user input. */
export function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(`Invariant violation: ${message}`);
  }
}
