import React from "react";
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

import { AnimatedPosition, AnimatedStyleApp } from "@/constants/types";

export type CirclePosition = AnimatedPosition;
export type CircleRadius = SharedValue<number>;

interface CircleProps {
  position: CirclePosition;
  diameter: CircleRadius;
  style?: AnimatedStyleApp;
}

export default function Circle({ position, diameter, style }: CircleProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    width: diameter.value,
    height: diameter.value,
    top: position.value.y,
    left: position.value.x,
    borderRadius: diameter.value / 2,
    position: "absolute",
  }));
  return <Animated.View testID="circleModel" style={[animatedStyle, style]} />;
}
