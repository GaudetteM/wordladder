import { StyleSheet, Text, View } from "react-native";

import Animated, {
  FadeInDown,
  LinearTransition,
} from "react-native-reanimated";

import { LetterTile } from "./LetterTile";

type Props = {
  word: string;
  previousWord?: string;
  editable?: boolean;
  selectedIndex?: number | null;
  onLetterPress?: (index: number) => void;
  label?: string;
  animate?: boolean;
  celebrating?: boolean;
};

export function WordRow({
  word,
  previousWord,
  editable = false,
  selectedIndex = null,
  onLetterPress,
  label,
  animate = true,
  celebrating = false,
}: Props) {
  return (
    <Animated.View
      entering={
        animate
          ? FadeInDown.duration(280).springify().damping(19).stiffness(180)
          : undefined
      }
      layout={
        animate
          ? LinearTransition.springify().damping(20).stiffness(180)
          : undefined
      }
      style={styles.container}
    >
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
            celebrating={celebrating}
            celebrationIndex={index}
            onPress={() => onLetterPress?.(index)}
          />
        ))}
      </View>
    </Animated.View>
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
