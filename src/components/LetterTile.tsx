import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import * as Haptics from "expo-haptics";

type Props = {
  letter: string;
  editable?: boolean;
  selected?: boolean;
  changed?: boolean;
  onPress?: () => void;
};

export function LetterTile({
  letter,
  editable = false,
  selected = false,
  changed = false,
  onPress,
}: Props) {
  return (
    <Pressable
      onPress={() => {
        if (!editable) return;

        void Haptics.selectionAsync();
        onPress?.();
      }}
      disabled={!editable}
      accessibilityRole={editable ? "button" : "text"}
      accessibilityLabel={
        editable ? `Change letter ${letter}` : `Letter ${letter}`
      }
      accessibilityState={editable ? { selected } : undefined}
      style={[
        styles.tile,
        editable && styles.editable,
        changed && styles.changed,
        selected && styles.selected,
      ]}
    >
      <Text style={styles.letter}>{letter}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E9EDF2",
    borderWidth: 1,
    borderColor: "#E9EDF2",
  },
  editable: {
    backgroundColor: "#FFFFFF",
    borderColor: "#CBD5E1",
    borderWidth: 2,
  },
  selected: {
    borderColor: "#477BDB",
    backgroundColor: "#EFF5FF",
  },
  changed: {
    backgroundColor: "#DBEAFE",
    borderColor: "#BFDBFE",
  },
  letter: {
    fontSize: 25,
    fontWeight: "700",
    color: "#1E293B",
  },
});
