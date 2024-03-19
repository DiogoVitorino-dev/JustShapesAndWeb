import React from "react";
import { StyleSheet } from "react-native";
import { useAnimatedStyle, useDerivedValue } from "react-native-reanimated";

import { AnimatedView } from "@/components/shared";
import Colors from "@/constants/Colors";
import {
  AnimatedAngle,
  AnimatedPosition,
  AnimatedSize,
  AnimatedStyleApp,
  Position,
  Size,
  Angle,
} from "@/constants/commonTypes";

export type RectanglePosition = AnimatedPosition | Position;
export type RectangleSize = AnimatedSize | Size;
export type RectangleAngle = AnimatedAngle | Angle;

export interface RectangleProps {
  position?: RectanglePosition;
  angle?: RectangleAngle;
  size?: RectangleSize;
  style?: AnimatedStyleApp;
}

export default function Rectangle({
  position = { x: 0, y: 0 },
  angle = 0,
  size = { width: 50, height: 100 },
  style,
}: RectangleProps) {
  const derivedPosition = useDerivedValue(() =>
    "value" in position ? position.value : position,
  );
  const derivedSize = useDerivedValue(() =>
    "value" in size ? size.value : size,
  );
  const derivedAngle = useDerivedValue(() =>
    typeof angle === "number" ? angle : angle.value,
  );

  const animatedStyle = useAnimatedStyle(() => ({
    width: derivedSize.value.width,
    height: derivedSize.value.height,
    top: derivedPosition.value.y,
    left: derivedPosition.value.x,
    transform: [{ rotate: derivedAngle.value + "deg" }],
  }));

  return (
    <AnimatedView
      testID="rectangleModel"
      style={
        Array.isArray(style)
          ? style.concat([animatedStyle, styles.default])
          : [animatedStyle, styles.default, style]
      }
    />
  );
}

const styles = StyleSheet.create({
  default: {
    backgroundColor: Colors.entity.enemy,
    position: "absolute",
  },
});
