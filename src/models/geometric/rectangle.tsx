import React from "react";
import { StyleSheet } from "react-native";
import { useAnimatedStyle } from "react-native-reanimated";

import { AnimatedView } from "@/components/shared";
import Colors from "@/constants/Colors";
import {
  AnimatedAngle,
  AnimatedPosition,
  AnimatedSize,
  AnimatedStyleApp,
} from "@/constants/commonTypes";

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
    <AnimatedView
      testID="rectangleModel"
      style={[animatedStyle, styles.default, style]}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    backgroundColor: Colors.entity.enemy,
    position: "absolute",
  },
});
