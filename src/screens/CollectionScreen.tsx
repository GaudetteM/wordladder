import { useEffect, useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import type { PuzzleCollection } from "../game/types";
import { getProgress, type ProgressMap } from "../game/progress";

type CollectionScreenProps = {
  collection: PuzzleCollection;
  onSelectPuzzle: (puzzleId: string) => void;
  onBack: () => void;
};

export function CollectionScreen({
  collection,
  onSelectPuzzle,
  onBack,
}: CollectionScreenProps) {
  const { width } = useWindowDimensions();

  const [progress, setProgress] = useState<ProgressMap>({});

  useEffect(() => {
    let active = true;

    getProgress().then((savedProgress) => {
      if (active) setProgress(savedProgress);
    });

    return () => {
      active = false;
    };
  }, []);

  const completedCount = collection.puzzles.filter(
    (puzzle) => progress[puzzle.id]?.completed,
  ).length;

  const totalCount = collection.puzzles.length;

  const completionPercent =
    totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const horizontalPadding = 20;
  const gap = 12;
  const cardWidth = (width - horizontalPadding * 2 - gap) / 2;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <Pressable
          onPress={onBack}
          style={styles.backButton}
          accessibilityRole="button"
        >
          <Text style={styles.backText}>‹ Collections</Text>
        </Pressable>

        <View style={styles.header}>
          <Text style={styles.eyebrow}>PUZZLE COLLECTION</Text>
          <Text style={styles.title}>{collection.title}</Text>
          <Text style={styles.subtitle}>
            Pick a ladder and find your way to the goal.
          </Text>

          <View style={styles.progressSection}>
            <View style={styles.progressLabels}>
              <Text style={styles.progressTitle}>Collection Progress</Text>
              <Text style={styles.progressCount}>
                {completedCount} / {totalCount} completed
              </Text>
            </View>

            <View
              style={styles.progressTrack}
              accessibilityRole="progressbar"
              accessibilityValue={{
                min: 0,
                max: totalCount,
                now: completedCount,
              }}
            >
              <View
                style={[
                  styles.progressFill,
                  { width: `${completionPercent}%` },
                ]}
              />
            </View>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
        >
          {collection.puzzles.map((puzzle, index) => (
            <Pressable
              key={puzzle.id}
              onPress={() => onSelectPuzzle(puzzle.id)}
              accessibilityRole="button"
              accessibilityLabel={`Puzzle ${index + 1}: ${puzzle.start} to ${puzzle.target}, ${puzzle.difficulty}`}
              style={({ pressed }) => [
                styles.card,
                { width: cardWidth },
                pressed && styles.cardPressed,
              ]}
            >
              <View style={styles.cardTop}>
                <Text style={styles.puzzleNumber}>
                  {String(index + 1).padStart(2, "0")}
                </Text>

                <View
                  style={[
                    styles.completionIcon,
                    progress[puzzle.id]?.completed && styles.completedIcon,
                  ]}
                >
                  <Text
                    style={[
                      styles.completionIconText,
                      progress[puzzle.id]?.completed &&
                        styles.completedIconText,
                    ]}
                  >
                    {progress[puzzle.id]?.completed ? "✓" : "○"}
                  </Text>
                </View>
              </View>

              <View style={styles.words}>
                <Text style={styles.startWord}>{puzzle.start}</Text>
                <Text style={styles.arrow}>↓</Text>
                <Text style={styles.targetWord}>{puzzle.target}</Text>
              </View>

              <View style={styles.cardBottom}>
                <Text
                  style={[
                    styles.difficulty,
                    puzzle.difficulty === "easy" && styles.easyText,
                    puzzle.difficulty === "medium" && styles.mediumText,
                    puzzle.difficulty === "hard" && styles.hardText,
                  ]}
                >
                  {puzzle.difficulty.toUpperCase()}
                </Text>
                <Text style={styles.moves}>{puzzle.expectedMoves} moves</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  screen: {
    flex: 1,
    paddingHorizontal: 20,
  },
  backButton: {
    alignSelf: "flex-start",
    paddingTop: 10,
    paddingBottom: 8,
    paddingRight: 16,
  },
  backText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#477BDB",
  },
  header: {
    paddingTop: 12,
    paddingBottom: 22,
    gap: 7,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.8,
    color: "#477BDB",
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#0F172A",
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: "#64748B",
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 5,
  },
  count: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#CBD5E1",
  },
  progressSection: {
    marginTop: 14,
    gap: 10,
  },
  progressLabels: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  progressTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
  },
  progressCount: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },
  progressTrack: {
    height: 7,
    borderRadius: 4,
    backgroundColor: "#E2E8F0",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: "#477BDB",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 12,
    paddingBottom: 28,
  },
  card: {
    minHeight: 155,
    padding: 14,
    borderRadius: 16,
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
  },
  puzzleNumber: {
    fontSize: 12,
    fontWeight: "800",
    color: "#94A3B8",
    letterSpacing: 0.5,
  },
  difficultyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  easyDot: {
    backgroundColor: "#22C55E",
  },
  mediumDot: {
    backgroundColor: "#F59E0B",
  },
  hardDot: {
    backgroundColor: "#EF4444",
  },
  words: {
    alignItems: "flex-start",
    gap: 1,
    paddingVertical: 8,
  },
  startWord: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 0.5,
    color: "#0F172A",
  },
  arrow: {
    fontSize: 15,
    lineHeight: 18,
    color: "#477BDB",
  },
  targetWord: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.4,
    color: "#477BDB",
  },
  cardBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 4,
  },

  completionIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
  },
  completedIcon: {
    backgroundColor: "#DCFCE7",
    borderColor: "#86EFAC",
  },
  completedIconText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#15803D",
  },
  completionIconText: {
    fontSize: 16,
    lineHeight: 20,
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
  difficulty: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.6,
    color: "#64748B",
  },
  moves: {
    fontSize: 10,
    fontWeight: "600",
    color: "#94A3B8",
  },
});
