import { ScrollView, StyleSheet, Text, View } from "react-native";
import { collections } from "../game/catalog";
import { SafeAreaView } from "react-native-safe-area-context";
import { getRecentDailyPuzzles } from "../game/daily";
import { getProgress, type ProgressMap } from "../game/progress";
import { useEffect, useState } from "react";
import CollectionCard from "../components/CollectionsCard";
import DailyPuzzleSection from "../components/DailyPuzzleSection";

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
          <Text style={styles.title}>One letter at a time.</Text>
          <Text style={styles.subtitle}>
            Change one letter at a time to reach the goal.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.section}>
            <DailyPuzzleSection
              puzzles={dailyPuzzles}
              progress={progress}
              onSelectDaily={onSelectDaily}
            />

            <Text style={styles.sectionTitle}>Collections</Text>

            {collections.map((collection) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                progress={progress}
                onPress={() => onSelectCollection(collection.id)}
              />
            ))}
          </View>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
});
