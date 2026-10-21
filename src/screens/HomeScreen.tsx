import React from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { collections } from "../game/catalog";

type HomeScreenProps = {
  onSelectCollection: (collectionId: string) => void;
};

export function HomeScreen({ onSelectCollection }: HomeScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>WORD LADDER</Text>
          <Text style={styles.title}>Find your next word.</Text>
          <Text style={styles.subtitle}>
            Change one letter at a time to reach the goal.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Collections</Text>

          {collections.map((collection) => (
            <Pressable
              key={collection.id}
              onPress={() => onSelectCollection(collection.id)}
              style={({ pressed }) => [
                styles.collectionCard,
                pressed && styles.cardPressed,
              ]}
              accessibilityRole="button"
            >
              <View style={styles.cardContent}>
                <View style={styles.cardHeading}>
                  <Text style={styles.cardTitle}>{collection.title}</Text>
                  <Text style={styles.badge}>FREE</Text>
                </View>

                <Text style={styles.cardDescription}>
                  {collection.description}
                </Text>

                <Text style={styles.cardFooter}>
                  {collection.puzzles.length} puzzles
                </Text>
              </View>

              <Text style={styles.arrow}>›</Text>
            </Pressable>
          ))}
        </View>
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
    paddingHorizontal: 24,
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
