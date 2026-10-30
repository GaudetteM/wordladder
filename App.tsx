import React, { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { HomeScreen } from "./src/screens/HomeScreen";
import { CollectionScreen } from "./src/screens/CollectionScreen";
import { GameScreen } from "./src/screens/GameScreen";
import { getCollectionById, getPuzzleById } from "./src/game/catalog";
import { getDailyPuzzle } from "./src/game/daily";
import { formatDailyDate } from "./src/utils";

type Screen =
  | { name: "home" }
  | { name: "collection"; collectionId: string }
  | { name: "game"; collectionId: string; puzzleId: string }
  | { name: "daily"; date: string };

export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: "home" });

  function openCollection(collectionId: string) {
    setScreen({ name: "collection", collectionId });
  }

  function openPuzzle(collectionId: string, puzzleId: string) {
    setScreen({ name: "game", collectionId, puzzleId });
  }

  function openDaily(date: string) {
    setScreen({ name: "daily", date });
  }

  function returnToCollection(collectionId: string) {
    setScreen({ name: "collection", collectionId });
  }

  const collection =
    screen.name === "collection" || screen.name === "game"
      ? getCollectionById(screen.collectionId)
      : undefined;

  const puzzle =
    screen.name === "game" ? getPuzzleById(screen.puzzleId) : undefined;

  return (
    <SafeAreaProvider>
      {screen.name === "home" && (
        <HomeScreen
          onSelectCollection={openCollection}
          onSelectDaily={openDaily}
        />
      )}

      {screen.name === "daily" &&
        (() => {
          const puzzle = getDailyPuzzle(screen.date);

          if (!puzzle) return null;

          return (
            <GameScreen
              key={`daily-${screen.date}`}
              puzzle={puzzle}
              title={formatDailyDate(screen.date)}
              progressId={`daily:${screen.date}`}
              onBack={() => setScreen({ name: "home" })}
            />
          );
        })()}

      {screen.name === "collection" && collection && (
        <CollectionScreen
          collection={collection}
          onBack={() => setScreen({ name: "home" })}
          onSelectPuzzle={(puzzleId) => openPuzzle(collection.id, puzzleId)}
        />
      )}

      {screen.name === "game" && collection && puzzle && (
        <GameScreen
          key={puzzle.id}
          puzzle={puzzle}
          onNextPuzzle={() => {
            const index = collection.puzzles.findIndex(
              (item) => item.id === puzzle.id,
            );
            const nextPuzzle = collection.puzzles[index + 1];

            if (nextPuzzle) {
              openPuzzle(collection.id, nextPuzzle.id);
            } else {
              returnToCollection(collection.id);
            }
          }}
          onBack={() => returnToCollection(collection.id)}
        />
      )}
    </SafeAreaProvider>
  );
}
