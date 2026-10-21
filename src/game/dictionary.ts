import rawDictionary from "./data/dictionary.json";

export const dictionaryByLength = rawDictionary;

export const dictionary = new Set<string>(
  Object.values(dictionaryByLength).flat(),
);

export function isValidDictionaryWord(word: string): boolean {
  return dictionary.has(word.toLowerCase().trim());
}
