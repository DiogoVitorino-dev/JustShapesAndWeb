import React from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { ButtonProps } from "..";

interface AreaProps extends ButtonProps {
  indicatorSize?: number;
}

export function AreaButton({ onPress, indicatorSize = 50 }: AreaProps) {
  const opacityIndicator = useSharedValue(0);
  const scaleIndicator = useSharedValue(1);
  const posIndicator = useSharedValue({ x: 0, y: 0 });

  const tap = Gesture.Pan()
    .maxPointers(1)
    .onBegin(({ x, y }) => {
      posIndicator.value = {
        x: x - indicatorSize / 2,
        y: y - indicatorSize / 2,
      };
    })
    .onChange(({ x, y }) => {
      posIndicator.value = {
        x: x - indicatorSize / 2,
        y: y - indicatorSize / 2,
      };
    })
    .onTouchesDown(() => {
      if (onPress) {
        onPress({ jumping: true });
      }

      opacityIndicator.value = 1;
      scaleIndicator.value = withRepeat(
        withTiming(1.5, { duration: 300, easing: Easing.out(Easing.circle) }),
        -1,
        true,
      );
    })
    .onTouchesUp(() => {
      if (onPress) {
        onPress({ jumping: false });
      }
      scaleIndicator.value = 1;
      opacityIndicator.value = 0;
    });

  const indicatorAnimatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(opacityIndicator.value, { duration: 100 }),
    top: withTiming(posIndicator.value.y, { duration: 50 }),
    left: withTiming(posIndicator.value.x, { duration: 50 }),
    transform: [{ scale: scaleIndicator.value }],
  }));

  return (
    <GestureDetector gesture={tap}>
      <View style={styles.area}>
        <Animated.View
          style={[
            indicatorAnimatedStyle,
            styles.indicator,
            {
              width: indicatorSize,
              height: indicatorSize,
              borderRadius: indicatorSize / 2,
            },
          ]}
        />
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  area: {
    width: "50%",
    height: "100%",
  },
  indicator: {
    borderColor: "lime",
    borderWidth: 3,
    zIndex: 1000,
  },
});
