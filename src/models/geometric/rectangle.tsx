import React from "react";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

import {
  AnimatedAngle,
  AnimatedPosition,
  AnimatedSize,
  AnimatedViewStyle,
} from "@/constants/types";

export type RectanglePosition = AnimatedPosition;
export type RectangleSize = AnimatedSize;
export type RectangleAngle = AnimatedAngle;

interface RectangleGeometricProps {
  position: RectanglePosition;
  angle?: RectangleAngle;
  size?: RectangleSize;
  style?: AnimatedViewStyle;
}

export default function Rectangle({
  position,
  angle,
  style,
  size,
}: RectangleGeometricProps) {
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
