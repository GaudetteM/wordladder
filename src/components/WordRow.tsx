import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { LetterTile } from "./LetterTile";

type Props = {
  word: string;
  previousWord?: string;
  editable?: boolean;
  selectedIndex?: number | null;
  onLetterPress?: (index: number) => void;
  label?: string;
};

export function WordRow({
  word,
  previousWord,
  editable = false,
  selectedIndex = null,
  onLetterPress,
  label,
}: Props) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.row}>
        {word.split("").map((letter, index) => (
          <LetterTile
            key={index}
            letter={letter}
            editable={editable}
            selected={selectedIndex === index}
            changed={
              !editable &&
              previousWord != null &&
              previousWord[index] !== letter
            }
            onPress={() => onLetterPress?.(index)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: "#64748B",
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
});
