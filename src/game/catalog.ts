import starterData from "./data/collections/starter.json";
import challengeData from "./data/collections/challenge.json";
import type { Puzzle, PuzzleCollection } from "./types";

const starterPuzzles = starterData as Puzzle[];
const challengePuzzles = challengeData as Puzzle[];

export const collections: PuzzleCollection[] = [
  {
    id: "starter",
    title: "Starter Collection",
    description: "20 approachable puzzles to get you started.",
    unlockType: "free",
    puzzles: starterPuzzles,
  },
  {
    id: "challenge",
    title: "The Challenge",
    description: "20 tougher puzzles to test your word skills.",
    unlockType: "free",
    puzzles: challengePuzzles,
  },
];

export function getCollectionById(id: string): PuzzleCollection | undefined {
  return collections.find((collection) => collection.id === id);
}

export function getPuzzleById(puzzleId: string): Puzzle | undefined {
  for (const collection of collections) {
    const puzzle = collection.puzzles.find((item) => item.id === puzzleId);

    if (puzzle) return puzzle;
  }

  return undefined;
}
