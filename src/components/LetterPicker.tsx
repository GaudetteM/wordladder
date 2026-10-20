import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const ROWS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

type Props = {
  onSelect: (letter: string) => void;
  disabled?: boolean;
};

export function LetterPicker({ onSelect, disabled = false }: Props) {
  return (
    <View style={styles.container}>
      {ROWS.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.split("").map((letter) => (
            <Pressable
              key={letter}
              disabled={disabled}
              onPress={() => onSelect(letter)}
              accessibilityRole="button"
              accessibilityLabel={`Replace with ${letter}`}
              style={({ pressed }) => [
                styles.key,
                pressed && styles.pressed,
                disabled && styles.disabled,
              ]}
            >
              <Text style={styles.keyText}>{letter}</Text>
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    width: "100%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
  },
  key: {
    flex: 1,
    maxWidth: 40,
    height: 46,
    borderRadius: 7,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    backgroundColor: "#BFDBFE",
  },
  disabled: {
    opacity: 0.4,
  },
  keyText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#334155",
  },
});
