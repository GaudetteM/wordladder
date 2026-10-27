import { useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

type Props = {
  index: number;
  active: boolean;
};

export function StampStar({ index, active }: Props) {
  const scale = useSharedValue(0);
  const rotation = useSharedValue(-18);

  useEffect(() => {
    if (!active) {
      scale.value = 0;
      rotation.value = -18;
      return;
    }

    const delay = index * 260;

    scale.value = withDelay(
      delay,
      withSequence(
        withTiming(1.3, { duration: 110 }),
        withSpring(1, { damping: 9, stiffness: 250 }),
      ),
    );

    rotation.value = withDelay(
      delay,
      withSpring(0, { damping: 12, stiffness: 230 }),
    );

    // Haptics are scheduled separately on the JS thread.
    // We'll coordinate these from the parent component.
  }, [active, index, scale, rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: scale.value === 0 ? 0 : 1,
    transform: [{ rotate: `${rotation.value}deg` }, { scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.star, animatedStyle]}>
      <Text style={styles.symbol}>★</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  star: {
    width: 44,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  symbol: {
    fontSize: 39,
    color: "#E5A63A",
    textShadowColor: "rgba(180, 120, 20, 0.25)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
});
