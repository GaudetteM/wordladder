export type ValidationResult =
  | { valid: true }
  | {
      valid: false;
      reason: string;
    };

export function countDifferences(a: string, b: string): number {
  if (a.length !== b.length) {
    return Infinity;
  }

  let differences = 0;

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      differences++;
    }
  }

  return differences;
}

export function validateWord(
  previous: string,
  candidate: string,
  dictionary: Set<string>,
): ValidationResult {
  const previousWord = previous.toLowerCase().trim();
  const word = candidate.toLowerCase().trim();

  if (word.length !== previousWord.length) {
    return {
      valid: false,
      reason: "Word length must stay the same.",
    };
  }

  if (countDifferences(previousWord, word) !== 1) {
    return {
      valid: false,
      reason: "Change exactly one letter.",
    };
  }

  if (!dictionary.has(word)) {
    return {
      valid: false,
      reason: "Not a recognized word.",
    };
  }

  return { valid: true };
}
