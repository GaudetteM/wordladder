import React, { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { GameScreen } from "./src/screens/GameScreen";
import { puzzles } from "./src/game/puzzles";

export default function App() {
  const [puzzleIndex, setPuzzleIndex] = useState(0);

  const puzzle = puzzles[puzzleIndex];

  function handleNextPuzzle() {
    setPuzzleIndex((current) => Math.min(current + 1, puzzles.length - 1));
  }

  return (
    <SafeAreaProvider>
      <GameScreen
        key={puzzle.id}
        puzzle={puzzle}
        onNextPuzzle={
          puzzleIndex < puzzles.length - 1 ? handleNextPuzzle : undefined
        }
      />
    </SafeAreaProvider>
  );
}
