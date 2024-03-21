import React from "react";
import { StyleSheet } from "react-native";
import {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";

import { AnimatedView } from "@/components/shared";
import Colors from "@/constants/Colors";
import { AnimatedStyleApp, Diameter, Position } from "@/constants/commonTypes";

export interface CircleData extends Partial<Position> {
  diameter?: Diameter;
}

export interface CircleProps {
  data?: SharedValue<CircleData> | CircleData;
  style?: AnimatedStyleApp;
}

const initialValues: Required<CircleData> = {
  diameter: 50,
  x: 0,
  y: 0,
};

export default function Circle({ data, style }: CircleProps) {
  const derivedData = useDerivedValue<Required<CircleData>>(() => {
    const { diameter, x, y } = initialValues;
    if (data && "value" in data) {
      return {
        diameter: data.value.diameter || diameter,
        x: data.value.x || x,
        y: data.value.y || y,
      };
    }
    return {
      diameter: data?.diameter || diameter,
      x: data?.x || x,
      y: data?.y || y,
    };
  });

  const animatedStyle = useAnimatedStyle(() => ({
    width: derivedData.value.diameter,
    height: derivedData.value.diameter,
    top: derivedData.value.y,
    left: derivedData.value.x,
    borderRadius: derivedData.value.diameter / 2,
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
