import React from "react";
import { StyleSheet } from "react-native";
import {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";

import { AnimatedView } from "@/components/shared";
import Colors from "@/constants/Colors";
import {
  AnimatedPosition,
  AnimatedStyleApp,
  Position,
} from "@/constants/commonTypes";

export type CirclePosition = AnimatedPosition | Position;
export type CircleRadius = SharedValue<number> | number;

interface CircleProps {
  position: CirclePosition;
  diameter: CircleRadius;
  style?: AnimatedStyleApp;
}

export default function Circle({ position, diameter, style }: CircleProps) {
  const size = useDerivedValue(() =>
    typeof diameter === "number" ? diameter : diameter.value,
  );

  const pos = useDerivedValue(() =>
    "value" in position ? position.value : position,
  );

  const animatedStyle = useAnimatedStyle(() => ({
    width: size.value,
    height: size.value,
    top: pos.value.y,
    left: pos.value.x,
    borderRadius: size.value / 2,
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
