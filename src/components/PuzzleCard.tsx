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

  const medalStyle =
    medal === "gold"
      ? styles.goldStars
      : medal === "silver"
        ? styles.silverStars
        : styles.bronzeStars;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Puzzle ${index + 1}: ${puzzle.start} to ${puzzle.target}, ${puzzle.difficulty}${
        result?.completed ? ", completed" : ", not completed"
      }`}
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

        <View style={styles.result}>
          {stars ? (
            <Text style={[styles.stars, medalStyle]}>{stars}</Text>
          ) : result?.completed ? (
            <Text style={styles.completedMark}>✓</Text>
          ) : (
            <Text style={styles.uncompletedMark}>○</Text>
          )}
        </View>
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

      <View style={styles.cardBottom}>
        <Text
          style={[
            styles.difficulty,
            puzzle.difficulty === "easy" && styles.easyText,
            puzzle.difficulty === "medium" && styles.mediumText,
            puzzle.difficulty === "hard" && styles.hardText,
          ]}
          numberOfLines={1}
        >
          {puzzle.difficulty.toUpperCase()}
        </Text>

        <Text style={styles.moves} numberOfLines={1}>
          {puzzle.expectedMoves} moves
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 128,
    padding: 10,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    justifyContent: "space-between",
  },
  cardPressed: {
    opacity: 0.7,
    backgroundColor: "#EFF6FF",
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 2,
  },
  puzzleNumber: {
    fontSize: 11,
    fontWeight: "800",
    color: "#94A3B8",
    letterSpacing: 0.3,
  },
  result: {
    minHeight: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  stars: {
    fontSize: 12,
    fontWeight: "900",
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
    alignItems: "flex-start",
    gap: 0,
    paddingVertical: 6,
  },
  startWord: {
    maxWidth: "100%",
    fontSize: 20,
    fontWeight: "500",
    letterSpacing: 0.2,
    color: "#0F172A",
  },
  arrow: {
    fontSize: 12,
    lineHeight: 15,
    color: "#477BDB",
  },
  targetWord: {
    maxWidth: "100%",
    fontSize: 17,
    fontWeight: "500",
    letterSpacing: 0.2,
    color: "#477BDB",
  },
  cardBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 3,
  },
  difficulty: {
    flexShrink: 1,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.3,
    color: "#64748B",
  },
  moves: {
    flexShrink: 0,
    fontSize: 9,
    fontWeight: "600",
    color: "#94A3B8",
  },
  easyText: {
    color: "#16A34A",
  },
  mediumText: {
    color: "#D97706",
  },
  hardText: {
    color: "#DC2626",
  },
  brutalText: {
    color: "#7C3AED",
  },
});
