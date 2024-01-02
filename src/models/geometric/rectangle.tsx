import React from "react";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

import {
  Angle,
  AnimatedAngle,
  AnimatedPosition,
  AnimatedSize,
  AnimatedViewStyle,
  Position,
  Size,
} from "@/constants/types";

export interface Rectangle extends Size, Position {
  angle: Angle;
}

interface RectangleGeometricProps {
  size: AnimatedSize;
  angle: AnimatedAngle;
  position: AnimatedPosition;
  style?: AnimatedViewStyle;
}

export default function RectangleGeometric({
  position,
  angle,
  style,
  size,
}: RectangleGeometricProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    width: size.value.width,
    height: size.value.height,
    top: position.value.y,
    left: position.value.x,
    transform: [{ rotate: angle.value + "deg" }],
  }));

  return (
    <Animated.View
      testID="rectangleGeometricModel"
      style={[animatedStyle, style, { position: "absolute" }]}
    />
  );
}
