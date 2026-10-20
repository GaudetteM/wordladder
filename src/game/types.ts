export type Puzzle = {
  id: string;
  start: string;
  target: string;
  expectedMoves: number;
  difficulty: "easy" | "medium" | "hard";
};

export type GameStatus = "playing" | "won";

export type GameState = {
  puzzle: Puzzle;
  words: string[];
  status: GameStatus;
};
