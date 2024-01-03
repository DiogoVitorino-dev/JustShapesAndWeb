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
  radius?: CircleRadius;
  style?: AnimatedStyleApp;
}

export default function Circle({ position, radius, style }: CircleProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    width: radius?.value || 20,
    height: radius?.value || 20,
    top: position.value.y,
    left: position.value.x,
  }));
  return <Animated.View testID="circleModel" style={[animatedStyle, style]} />;
}
