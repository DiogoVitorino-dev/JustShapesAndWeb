import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { ButtonProps } from "..";

import { View } from "@/components/shared";
import Colors from "@/constants/Colors";
import { Position } from "@/constants/commonTypes";

interface AreaProps extends ButtonProps {
  indicatorSize?: number;
  style?: ViewStyle;
}

export function AreaButton({ onPress, style, indicatorSize = 70 }: AreaProps) {
  const opacityIndicator = useSharedValue(0);
  const scaleIndicator = useSharedValue(1);
  const posIndicator = useSharedValue<Position>({ x: 0, y: 0 });

  const updateIndicatorPos = ({ x, y }: Position) => {
    "worklet";
    posIndicator.value = {
      x: x - indicatorSize / 2,
      y: y - indicatorSize / 2,
    };
  };

  const callOnPress = (pressing: boolean) => {
    "worklet";
    if (onPress) {
      onPress({ jumping: pressing });
    }
  };

  const tap = Gesture.Pan()
    .maxPointers(1)
    .shouldCancelWhenOutside(true)
    .onBegin(({ x, y }) => {
      updateIndicatorPos({ x, y });
      opacityIndicator.value = 1;
      scaleIndicator.value = withTiming(0.8);

      callOnPress(true);
    })
    .onUpdate(({ x, y }) => updateIndicatorPos({ x, y }))
    .onFinalize(() => {
      scaleIndicator.value = withTiming(1);
      opacityIndicator.value = 0;
      callOnPress(false);
    });

  const indicatorAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacityIndicator.value,
    top: posIndicator.value.y,
    left: posIndicator.value.x,
    transform: [
      {
        scale: scaleIndicator.value,
      },
    ],
  }));

  return (
    <GestureDetector gesture={tap}>
      <View style={[styles.area, style]}>
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
    position: "absolute",
  },
  indicator: {
    borderColor: Colors.control.button,
    borderWidth: 3,
    zIndex: 1000,
  },
});
