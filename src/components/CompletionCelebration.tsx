import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";

import { StampStar } from "./StampStar";
import type { PuzzleScore } from "../game/scoring";

type Props = {
  score: PuzzleScore;
};

export function CompletionCelebration({ score }: Props) {
  const [started, setStarted] = useState(false);

  const stars =
    score.medal === "gold"
      ? 3
      : score.medal === "silver"
        ? 2
        : score.medal === "bronze"
          ? 1
          : 0;

  useEffect(() => {
    // Allow the target-letter flip to finish first.
    const startDelay = 650;
    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(setTimeout(() => setStarted(true), startDelay));

    for (let i = 0; i < stars; i++) {
      timers.push(
        setTimeout(
          () => {
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          },
          startDelay + i * 260,
        ),
      );
    }

    return () => timers.forEach(clearTimeout);
  }, [stars]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Puzzle Complete!</Text>

      <View style={styles.stars}>
        {[0, 1, 2].map((index) => (
          <View key={index} style={styles.starSlot}>
            <Text style={styles.placeholder}>☆</Text>

            {index < stars && (
              <View style={styles.overlay}>
                <StampStar index={index} active={started} />
              </View>
            )}
          </View>
        ))}
      </View>

      <Text style={styles.subtitle}>
        {score.moves} moves · Par {score.expectedMoves}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 7,
    paddingVertical: 10,
  },
  title: {
    fontSize: 19,
    fontWeight: "700",
    color: "#0F172A",
  },
  stars: {
    flexDirection: "row",
    gap: 10,
  },
  starSlot: {
    width: 44,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholder: {
    fontSize: 39,
    color: "#CBD5E1",
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
  },
  subtitle: {
    fontSize: 13,
    color: "#64748B",
  },
});
