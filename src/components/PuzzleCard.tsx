import { Pressable, StyleSheet, Text, View } from "react-native";

import type { Puzzle } from "../game/types";
import type { ProgressMap } from "../game/progress";

type PuzzleCardProps = {
  puzzle: Puzzle;
  index: number;
  progress: ProgressMap;
  width: number;
  onPress: () => void;
};

export default function PuzzleCard({
  puzzle,
  index,
  progress,
  width,
  onPress,
}: PuzzleCardProps) {
  const result = progress[puzzle.id];
  const medal = result?.bestMedal;

  const stars =
    medal === "gold"
      ? "★★★"
      : medal === "silver"
        ? "★★"
        : medal === "bronze"
          ? "★"
          : null;

  const starStyle =
    medal === "gold"
      ? styles.goldStars
      : medal === "silver"
        ? styles.silverStars
        : styles.bronzeStars;

  const statusLabel = result?.completed
    ? `completed${stars ? `, ${stars.length} stars` : ""}`
    : "not completed";

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Puzzle ${index + 1}: ${puzzle.start} to ${puzzle.target}, ${statusLabel}`}
      style={({ pressed }) => [
        styles.card,
        { width },
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.cardTop}>
        <Text style={styles.puzzleNumber}>
          {String(index + 1).padStart(2, "0")}
        </Text>

        {stars ? (
          <Text style={[styles.stars, starStyle]}>{stars}</Text>
        ) : result?.completed ? (
          <Text style={styles.completedMark}>✓</Text>
        ) : (
          <Text style={styles.uncompletedMark}>○</Text>
        )}
      </View>

      <View style={styles.words}>
        <Text style={styles.startWord} numberOfLines={1} adjustsFontSizeToFit>
          {puzzle.start}
        </Text>

        <Text style={styles.arrow}>↓</Text>

        <Text style={styles.targetWord} numberOfLines={1} adjustsFontSizeToFit>
          {puzzle.target}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 132,
    padding: 12,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    justifyContent: "space-between",
  },
  cardPressed: {
    opacity: 0.75,
    backgroundColor: "#EFF6FF",
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 18,
  },
  puzzleNumber: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 0.5,
  },
  stars: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: -1,
  },
  goldStars: {
    color: "#EAB308",
  },
  silverStars: {
    color: "#94A3B8",
  },
  bronzeStars: {
    color: "#C2410C",
  },
  completedMark: {
    fontSize: 15,
    fontWeight: "800",
    color: "#15803D",
  },
  uncompletedMark: {
    fontSize: 16,
    color: "#CBD5E1",
  },
  words: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    gap: 2,
  },
  startWord: {
    maxWidth: "100%",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.3,
    color: "#0F172A",
    textAlign: "center",
  },
  arrow: {
    fontSize: 14,
    lineHeight: 18,
    color: "#94A3B8",
  },
  targetWord: {
    maxWidth: "100%",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.3,
    color: "#477BDB",
    textAlign: "center",
  },
});
