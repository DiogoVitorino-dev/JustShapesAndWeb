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
  AnimatedStyleApp,
  Position,
  Size,
  Angle,
} from "@/constants/commonTypes";

export interface RectangleData extends Partial<Position>, Partial<Size> {
  angle?: Angle;
}

export interface RectangleProps {
  data?: SharedValue<RectangleData> | RectangleData;
  style?: AnimatedStyleApp;
}

const initialValues: Required<RectangleData> = {
  x: 0,
  y: 0,
  angle: 0,
  width: 50,
  height: 100,
};

export default function Rectangle({ data, style }: RectangleProps) {
  const derivedData = useDerivedValue<Required<RectangleData>>(() => {
    const { x, y, angle, width, height } = initialValues;

    if (data && "value" in data) {
      return {
        x: data.value.x || x,
        y: data.value.y || y,
        angle: data.value.angle || angle,
        width: data.value.width || width,
        height: data.value.height || height,
      };
    }
    return {
      x: data?.x || x,
      y: data?.y || y,
      angle: data?.angle || angle,
      width: data?.width || width,
      height: data?.height || height,
    };
  });

  const animatedStyle = useAnimatedStyle(() => ({
    width: derivedData.value.width,
    height: derivedData.value.height,
    top: derivedData.value.y,
    left: derivedData.value.x,
    transform: [{ rotate: derivedData.value.angle + "deg" }],
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
