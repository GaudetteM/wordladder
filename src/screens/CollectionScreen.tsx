import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import type { PuzzleCollection } from "../game/types";
import { getProgress, type ProgressMap } from "../game/progress";
import { SafeAreaView } from "react-native-safe-area-context";
import PuzzleCard from "../components/PuzzleCard";
import { getCollectionMastery } from "../game/mastery";

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
  const mastery = getCollectionMastery(collection, progress);

  const horizontalPadding = 20;
  const gap = 10;
  const cardWidth = (width - horizontalPadding * 2 - gap * 2) / 3;

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

            <View style={styles.masteryRow}>
              <Text style={styles.masteryStars}>★</Text>
              <Text style={styles.masteryText}>
                {mastery.earnedStars} / {mastery.possibleStars} stars
              </Text>
            </View>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
        >
          {collection.puzzles.map((puzzle, index) => (
            <PuzzleCard
              key={puzzle.id}
              puzzle={puzzle}
              index={index}
              progress={progress}
              width={cardWidth}
              onPress={() => onSelectPuzzle(puzzle.id)}
            />
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
    gap: 10,
    paddingBottom: 28,
  },
  masteryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  masteryStars: {
    fontSize: 16,
    color: "#D97706",
  },
  masteryText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },
});
