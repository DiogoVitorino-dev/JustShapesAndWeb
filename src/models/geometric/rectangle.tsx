import React from "react";
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

import { AnimatedViewStyle, Dimensions, Position } from "@/constants/types";

interface RectangleGeometricProps {
  dimensions: SharedValue<Dimensions>;
  position: SharedValue<Position>;
  angle?: SharedValue<number>;
  style?: AnimatedViewStyle;
}

export default function RectangleGeometric({
  angle,
  dimensions,
  position,
  style,
}: RectangleGeometricProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    width: dimensions.value.width,
    height: dimensions.value.height,
    top: position.value.y,
    left: position.value.x,
    transform: [{ rotate: (angle ? angle.value : 0) + "deg" }],
  }));

  return (
    <Animated.View style={[animatedStyle, style, { position: "absolute" }]} />
  );
}
