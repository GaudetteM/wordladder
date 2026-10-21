export type Difficulty = "easy" | "medium" | "hard";

export type Puzzle = {
  id: string;
  start: string;
  target: string;
  expectedMoves: number;
  difficulty: Difficulty;
};

export type PuzzleCollection = {
  id: string;
  title: string;
  description: string;
  unlockType: "free" | "paid";
  puzzles: Puzzle[];
};

export type GameStatus = "playing" | "won";

export type GameState = {
  puzzle: Puzzle;
  words: string[];
  status: GameStatus;
};
