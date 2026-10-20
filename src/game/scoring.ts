export type PuzzleScore = {
  moves: number;
  optimalMoves: number;
  extraMoves: number;
  efficiency: number;
  medal: "gold" | "silver" | "bronze" | "complete";
};

export function calculateScore(
  moves: number,
  optimalMoves: number,
): PuzzleScore {
  const extraMoves = Math.max(0, moves - optimalMoves);

  const efficiency = moves === 0 ? 0 : Math.round((optimalMoves / moves) * 100);

  let medal: PuzzleScore["medal"];

  if (extraMoves === 0) {
    medal = "gold";
  } else if (extraMoves <= 2) {
    medal = "silver";
  } else if (extraMoves <= 5) {
    medal = "bronze";
  } else {
    medal = "complete";
  }

  return {
    moves,
    optimalMoves,
    extraMoves,
    efficiency,
    medal,
  };
}
