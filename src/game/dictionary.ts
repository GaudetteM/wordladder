import rawDictionary from "./data/dictionary.json";

export const dictionaryByLength = rawDictionary;

export const dictionary = new Set<string>(
  Object.values(dictionaryByLength).flat(),
);

console.log("Dictionary size:", dictionary.size);
console.log("Has cold:", dictionary.has("cold"));
console.log("Has cord:", dictionary.has("cord"));

export function isValidDictionaryWord(word: string): boolean {
  return dictionary.has(word.toLowerCase().trim());
}
