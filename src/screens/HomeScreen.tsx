import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { collections } from "../game/catalog";
import { SafeAreaView } from "react-native-safe-area-context";
import { getRecentDailyPuzzles } from "../game/daily";
import { getProgress, type ProgressMap } from "../game/progress";
import { useEffect, useState } from "react";
import CollectionCard from "../components/CollectionsCard";

type HomeScreenProps = {
  onSelectCollection: (collectionId: string) => void;
  onSelectDaily: (date: string) => void;
};

export function HomeScreen({
  onSelectCollection,
  onSelectDaily,
}: HomeScreenProps) {
  const dailyPuzzles = getRecentDailyPuzzles();
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.screen}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>WORD LADDER</Text>
          <Text style={styles.title}>Find your next word.</Text>
          <Text style={styles.subtitle}>
            Change one letter at a time to reach the goal.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.dailySection}>
            <View style={styles.dailyHeader}>
              <Text style={styles.sectionTitle}>Daily Puzzles</Text>
              <Text style={styles.dailySubtitle}>Today + previous 6 days</Text>
            </View>

            <View style={styles.dailyGrid}>
              {dailyPuzzles.map((entry) => {
                const date = new Date(`${entry.date}T12:00:00`);
                const dailyProgress = progress[`daily:${entry.date}`];

                return (
                  <Pressable
                    key={entry.date}
                    onPress={() => onSelectDaily(entry.date)}
                    style={[
                      styles.dailyCard,
                      entry.isToday && styles.dailyCardToday,
                    ]}
                    accessibilityRole="button"
                  >
                    <Text style={styles.dailyWeekday}>
                      {date.toLocaleDateString("en-US", { weekday: "short" })}
                    </Text>

                    <Text style={styles.dailyDay}>{date.getDate()}</Text>

                    <Text
                      style={[
                        styles.dailyStatus,
                        dailyProgress?.bestMedal === "gold" && styles.goldText,
                        dailyProgress?.bestMedal === "silver" &&
                          styles.silverText,
                        dailyProgress?.bestMedal === "bronze" &&
                          styles.bronzeText,
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

          <Text style={styles.sectionTitle}>Collections</Text>

          {collections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              progress={progress}
              onPress={() => onSelectCollection(collection.id)}
            />
          ))}

          <CollectionCard
            key="locked-preview"
            collection={{
              id: "locked-preview",
              title: "Daily Challenges",
              description: "Tougher ladders. Bigger bragging rights.",
              unlockType: "paid",
              puzzles: [],
            }}
            progress={progress}
            onPress={() => {}}
          />
        </View>
      </ScrollView>
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
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  header: {
    paddingTop: 48,
    paddingBottom: 36,
    gap: 10,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    color: "#477BDB",
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "800",
    color: "#0F172A",
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: "#64748B",
  },
  section: {
    gap: 14,
    paddingBottom: 30,
  },
  dailySection: {
    gap: 14,
    marginBottom: 30,
  },
  dailyHeader: {
    gap: 4,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  collectionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardPressed: {
    opacity: 0.75,
  },
  cardContent: {
    flex: 1,
    gap: 8,
  },
  cardHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  badge: {
    overflow: "hidden",
    fontSize: 10,
    fontWeight: "800",
    color: "#2563EB",
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: "#64748B",
  },
  cardFooter: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "600",
    color: "#477BDB",
  },
  arrow: {
    marginLeft: 12,
    fontSize: 30,
    color: "#94A3B8",
  },
});
