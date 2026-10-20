import type { Puzzle } from "./types";

export const puzzles: Puzzle[] = [
  {
    id: "starter-001",
    start: "COLD",
    target: "WARM",
    expectedMoves: 4,
    difficulty: "easy",
  },
];

export const starterPuzzle = puzzles[0];

export function getPuzzleById(id: string): Puzzle | undefined {
  return puzzles.find((puzzle) => puzzle.id === id);
}
