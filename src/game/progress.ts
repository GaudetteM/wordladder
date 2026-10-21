import AsyncStorage from "@react-native-async-storage/async-storage";
import type { PuzzleScore } from "./scoring";

const STORAGE_KEY = "@wordladder/progress";

export type PuzzleProgress = {
  completed: boolean;
  bestMoves: number;
  bestMedal: PuzzleScore["medal"];
};

export type ProgressMap = Record<string, PuzzleProgress>;

export async function getProgress(): Promise<ProgressMap> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);

    if (!stored) return {};

    return JSON.parse(stored) as ProgressMap;
  } catch (error) {
    console.error("Failed to load puzzle progress:", error);
    return {};
  }
}

export async function savePuzzleCompletion(
  puzzleId: string,
  score: PuzzleScore,
): Promise<void> {
  const progress = await getProgress();
  const previous = progress[puzzleId];

  // Preserve the best result if the puzzle is replayed.
  if (previous && previous.bestMoves <= score.moves) {
    return;
  }

  progress[puzzleId] = {
    completed: true,
    bestMoves: score.moves,
    bestMedal: score.medal,
  };

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}
