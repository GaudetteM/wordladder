export type Puzzle = {
  id: string;
  start: string;
  target: string;
  optimalMoves: number;
};

export type GameStatus = "playing" | "won";

export type GameState = {
  puzzle: Puzzle;
  words: string[];
  status: GameStatus;
};
