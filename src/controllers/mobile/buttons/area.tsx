import React from "react";
import { GestureResponderEvent, Pressable, StyleSheet } from "react-native";
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { ButtonProps } from "..";

import { AnimatedView } from "@/components/shared";
import Colors from "@/constants/Colors";
import { Position } from "@/constants/types";

interface AreaProps extends ButtonProps {
  indicatorSize?: number;
}

export function AreaButton({ onPress, indicatorSize = 70 }: AreaProps) {
  const opacityIndicator = useSharedValue(0);
  const scaleIndicator = useSharedValue(0);
  const posIndicator = useSharedValue<Position>({ x: 0, y: 0 });

  const callOnPress = (press: boolean) => {
    "worklet";
    if (onPress) {
      onPress({ jumping: press });
    }
  };

  const updateIndicatorPos = ({ x, y }: Position) => {
    "worklet";
    posIndicator.value = {
      x: x - indicatorSize / 2,
      y: y - indicatorSize / 2,
    };
  };

  const onMove = ({ nativeEvent }: GestureResponderEvent) => {
    "worklet";
    updateIndicatorPos({ x: nativeEvent.locationX, y: nativeEvent.locationY });
  };

  const onPressIn = ({ nativeEvent }: GestureResponderEvent) => {
    "worklet";
    updateIndicatorPos({ x: nativeEvent.locationX, y: nativeEvent.locationY });

    opacityIndicator.value = 1;
    scaleIndicator.value = withRepeat(
      withTiming(1.3, { duration: 300, easing: Easing.out(Easing.circle) }),
      -1,
      true,
    );
    callOnPress(true);
  };

  const onPressOut = () => {
    "worklet";
    opacityIndicator.value = 0;
    scaleIndicator.value = 0;
    callOnPress(false);
  };

  const indicatorAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacityIndicator.value,
    transform: [
      {
        translateX: posIndicator.value.x,
      },
      {
        translateY: posIndicator.value.y,
      },
      {
        scale: scaleIndicator.value,
      },
    ],
  }));

  return (
    <Pressable
      onTouchMove={onMove}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={styles.area}
      testID="pressableArea"
    >
      <AnimatedView
        transparent
        pointerEvents="none"
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
    </Pressable>
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
