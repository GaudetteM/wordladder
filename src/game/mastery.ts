import type { PuzzleCollection } from "./types";
import type { ProgressMap } from "./progress";
import type { PuzzleScore } from "./scoring";

export function getStarCount(medal: PuzzleScore["medal"] | undefined): number {
  switch (medal) {
    case "gold":
      return 3;
    case "silver":
      return 2;
    case "bronze":
      return 1;
    default:
      return 0;
  }
}

export function getCollectionMastery(
  collection: PuzzleCollection,
  progress: ProgressMap,
) {
  const earnedStars = collection.puzzles.reduce(
    (total, puzzle) => total + getStarCount(progress[puzzle.id]?.bestMedal),
    0,
  );

  const possibleStars = collection.puzzles.length * 3;

  return {
    earnedStars,
    possibleStars,
    percentage:
      possibleStars > 0 ? Math.round((earnedStars / possibleStars) * 100) : 0,
  };
}
