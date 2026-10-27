import { useEffect } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

import Animated, {
  ZoomIn,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = {
  letter: string;
  editable?: boolean;
  selected?: boolean;
  changed?: boolean;
  celebrating?: boolean;
  celebrationIndex?: number;
  onPress?: () => void;
};

export function LetterTile({
  letter,
  editable = false,
  selected = false,
  changed = false,
  celebrating = false,
  celebrationIndex = 0,
  onPress,
}: Props) {
  const scale = useSharedValue(1);
  const lift = useSharedValue(0);

  const celebration = useSharedValue(0);

  useEffect(() => {
    if (celebrating) {
      celebration.value = withDelay(
        celebrationIndex * 90,
        withSequence(
          withTiming(0.5, { duration: 130 }),
          withTiming(1, { duration: 170 }),
        ),
      );
    } else {
      celebration.value = 0;
    }
  }, [celebrating, celebrationIndex, celebration]);

  const celebrationStyle = useAnimatedStyle(() => {
    const progress = celebrating ? celebration.value : 0;

    return {
      backgroundColor: interpolateColor(
        progress,
        [0, 1],
        [editable ? "#FFFFFF" : changed ? "#DBEAFE" : "#E9EDF2", "#BFDBFE"],
      ),
      borderColor: interpolateColor(
        progress,
        [0, 1],
        [editable ? "#CBD5E1" : changed ? "#BFDBFE" : "#E9EDF2", "#60A5FA"],
      ),
      transform: [
        {
          scaleX: interpolate(progress, [0, 0.5, 1], [1, 0.08, 1]),
        },
      ],
    };
  });

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
      entering={changed ? ZoomIn.duration(180).springify() : undefined}
      style={styles.tileWrapper}
    >
      <Animated.View style={animatedStyle}>
        <AnimatedPressable
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
            celebrating && celebrationStyle,
          ]}
        >
          <Text style={styles.letter}>{letter}</Text>
        </AnimatedPressable>
      </Animated.View>
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
