import { Pressable, StyleSheet, Text, View } from "react-native";

import type { ProgressMap } from "../game/progress";

type DailyPuzzle = {
  date: string;
  isToday: boolean;
};

type DailyPuzzleSectionProps = {
  puzzles: DailyPuzzle[];
  progress: ProgressMap;
  onSelectDaily: (date: string) => void;
};

export default function DailyPuzzleSection({
  puzzles,
  progress,
  onSelectDaily,
}: DailyPuzzleSectionProps) {
  return (
    <View style={styles.dailySection}>
      <View style={styles.dailyHeader}>
        <Text style={styles.sectionTitle}>Daily Puzzles</Text>
        <Text style={styles.dailySubtitle}>Today + previous 6 days</Text>
      </View>

      <View style={styles.dailyGrid}>
        {puzzles.map((entry) => {
          const date = new Date(`${entry.date}T12:00:00`);
          const dailyProgress = progress[`daily:${entry.date}`];

          return (
            <Pressable
              key={entry.date}
              onPress={() => onSelectDaily(entry.date)}
              style={[styles.dailyCard, entry.isToday && styles.dailyCardToday]}
              accessibilityRole="button"
            >
              <Text style={styles.dailyWeekday}>
                {date.toLocaleDateString("en-US", {
                  weekday: "short",
                })}
              </Text>

              <Text style={styles.dailyDay}>{date.getDate()}</Text>

              <Text
                style={[
                  styles.dailyStatus,
                  dailyProgress?.bestMedal === "gold" && styles.goldText,
                  dailyProgress?.bestMedal === "silver" && styles.silverText,
                  dailyProgress?.bestMedal === "bronze" && styles.bronzeText,
                  dailyProgress?.bestMedal === "complete" &&
                    styles.dailyCompleted,
                ]}
              >
                {dailyProgress?.bestMedal === "gold"
                  ? "★★★"
                  : dailyProgress?.bestMedal === "silver"
                    ? "★★"
                    : dailyProgress?.bestMedal === "bronze"
                      ? "★"
                      : dailyProgress?.completed
                        ? "✓"
                        : entry.isToday
                          ? "TODAY"
                          : "PLAY"}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dailySection: {
    gap: 14,
    marginBottom: 30,
  },
  dailyHeader: {
    gap: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  dailySubtitle: {
    fontSize: 12,
    color: "#64748B",
  },
  dailyGrid: {
    flexDirection: "row",
    gap: 6,
  },
  dailyCard: {
    flex: 1,
    minWidth: 0,
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 2,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 6,
  },
  dailyCardToday: {
    backgroundColor: "#EFF6FF",
    borderColor: "#477BDB",
  },
  dailyWeekday: {
    fontSize: 10,
    fontWeight: "600",
    color: "#64748B",
  },
  dailyDay: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0F172A",
  },
  dailyCompleted: {
    color: "#2563EB",
  },
  dailyStatus: {
    fontSize: 9,
    fontWeight: "800",
    color: "#477BDB",
  },
  goldText: {
    color: "#D97706",
  },
  silverText: {
    color: "#64748B",
  },
  bronzeText: {
    color: "#B45309",
  },
});
