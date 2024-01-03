import React from "react";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

import {
  AnimatedAngle,
  AnimatedPosition,
  AnimatedSize,
  AnimatedStyleApp,
} from "@/constants/types";

export type RectanglePosition = AnimatedPosition;
export type RectangleSize = AnimatedSize;
export type RectangleAngle = AnimatedAngle;

interface RectangleProps {
  position: RectanglePosition;
  angle?: RectangleAngle;
  size?: RectangleSize;
  style?: AnimatedStyleApp;
}

export default function Rectangle({
  position,
  angle,
  style,
  size,
}: RectangleProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    width: size?.value.width || 50,
    height: size?.value.height || 100,
    top: position.value.y,
    left: position.value.x,
    transform: [{ rotate: angle?.value + "deg" }],
  }));

  return (
    <Animated.View
      testID="rectangleModel"
      style={[animatedStyle, style, { position: "absolute" }]}
    />
  );
}
