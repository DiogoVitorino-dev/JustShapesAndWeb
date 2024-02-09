import React from "react";
import { StyleSheet } from "react-native";
import { SharedValue, useAnimatedStyle } from "react-native-reanimated";

import { AnimatedView } from "@/components/shared";
import Colors from "@/constants/Colors";
import { AnimatedPosition, AnimatedStyleApp } from "@/constants/commonTypes";

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
  }));
  return (
    <AnimatedView
      testID="circleModel"
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
