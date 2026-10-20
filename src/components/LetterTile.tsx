import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import Animated, {
  FadeIn,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
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
  const scale = useSharedValue(1);
  const lift = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(selected ? 1.08 : 1, {
      damping: 14,
      stiffness: 260,
    });

    lift.value = withSpring(selected ? -5 : 0, {
      damping: 14,
      stiffness: 260,
    });
  }, [selected, scale, lift]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: lift.value }],
    zIndex: selected ? 2 : 1,
  }));

  return (
    <Animated.View
      style={[styles.tileWrapper, animatedStyle]}
      entering={changed ? ZoomIn.duration(220) : FadeIn.duration(120)}
    >
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
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tileWrapper: {
    borderRadius: 12,
  },
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
    shadowColor: "#477BDB",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 4,
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
