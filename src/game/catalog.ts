import starterData from "./data/collections/starter.json";
import type { Puzzle, PuzzleCollection } from "./types";

const starterPuzzles = starterData as Puzzle[];

export const collections: PuzzleCollection[] = [
  {
    id: "starter",
    title: "Starter Group",
    description: "10 easy puzzles to get you started.",
    unlockType: "free",
    puzzles: starterPuzzles,
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
