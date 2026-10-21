import { Pressable, StyleSheet, Text, View } from "react-native";

import type { PuzzleCollection } from "../game/types";
import type { ProgressMap } from "../game/progress";
import { LockKeyhole } from "lucide-react-native";

type CollectionCardProps = {
  collection: PuzzleCollection;
  progress: ProgressMap;
  onPress: () => void;
};

export default function CollectionCard({
  collection,
  progress,
  onPress,
}: CollectionCardProps) {
  const isLocked = collection.id === "locked-preview";
  const completedCount = collection.puzzles.filter(
    (puzzle) => progress[puzzle.id]?.completed,
  ).length;

  const totalCount = collection.puzzles.length;
  const progressPercent =
    totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        isLocked && styles.lockedCard,
        pressed && !isLocked && styles.cardPressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${collection.title}, ${completedCount} of ${totalCount} puzzles completed`}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardHeading}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {collection.title}
          </Text>

          {isLocked ? (
            <View style={[styles.badge, styles.lockedBadge]}>
              <LockKeyhole size={11} color="#64748B" />
              <Text style={styles.lockedBadgeText} numberOfLines={1}>
                LOCKED
              </Text>
            </View>
          ) : (
            <Text style={styles.badge} numberOfLines={1}>
              {collection.unlockType === "free" ? "FREE" : "PAID"}
            </Text>
          )}
        </View>

        <Text style={styles.cardDescription}>{collection.description}</Text>

        {isLocked ? (
          <Text style={styles.lockedMessage}>
            Coming soon · Premium collection
          </Text>
        ) : (
          <View style={styles.progressSection}>
            <View style={styles.progressLabels}>
              <Text style={styles.progressText}>
                {completedCount} of {totalCount} completed
              </Text>
              <Text style={styles.progressPercent}>
                {Math.round(progressPercent)}%
              </Text>
            </View>

            <View
              style={styles.progressTrack}
              accessibilityRole="progressbar"
              accessibilityLabel="Collection progress"
              accessibilityValue={{
                min: 0,
                max: totalCount,
                now: completedCount,
              }}
            >
              <View
                style={[styles.progressFill, { width: `${progressPercent}%` }]}
              />
            </View>
          </View>
        )}
      </View>

      <Text style={styles.arrow}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.99 }],
  },
  cardContent: {
    flex: 1,
    gap: 10,
  },
  cardHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  cardTitle: {
    flex: 1,
    minWidth: 0,
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
  },
  badge: {
    overflow: "hidden",
    fontSize: 10,
    fontWeight: "800",
    color: "#477BDB",
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  cardDescription: {
    fontSize: 13,
    lineHeight: 19,
    color: "#64748B",
  },
  lockedCard: {
    backgroundColor: "#F8FAFC",
    borderColor: "#CBD5E1",
    borderStyle: "dashed",
  },
  lockedBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    flexShrink: 0,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#E2E8F0",
  },

  lockedBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#64748B",
    includeFontPadding: false,
  },
  lockedMessage: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },
  progressSection: {
    gap: 7,
    marginTop: 2,
  },
  progressLabels: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  progressText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: "700",
    color: "#334155",
  },
  progressTrack: {
    height: 6,
    borderRadius: 999,
    backgroundColor: "#E2E8F0",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#477BDB",
  },
  arrow: {
    fontSize: 28,
    color: "#94A3B8",
    marginLeft: 12,
  },
});
