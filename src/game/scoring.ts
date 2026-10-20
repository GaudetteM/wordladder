export type PuzzleScore = {
  moves: number;
  expectedMoves: number;
  extraMoves: number;
  medal: "gold" | "silver" | "bronze" | "complete";
};

export function calculateScore(
  moves: number,
  expectedMoves: number,
): PuzzleScore {
  const extraMoves = Math.max(0, moves - expectedMoves);

  let medal: PuzzleScore["medal"];

  if (extraMoves === 0) medal = "gold";
  else if (extraMoves <= 2) medal = "silver";
  else if (extraMoves <= 5) medal = "bronze";
  else medal = "complete";

  return {
    moves,
    expectedMoves,
    extraMoves,
    medal,
  };
}
