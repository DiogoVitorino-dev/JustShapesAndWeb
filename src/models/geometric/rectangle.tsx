import React, { useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";

import Colors from "@/constants/Colors";
import {
  AnimatedProps,
  Position,
  Size,
  Angle,
  Entries,
} from "@/constants/commonTypes";
import { useCollisionSystem } from "@/hooks";
import { Collidable } from "@/scripts/collision/collisionDetector";

export interface RectangleData
  extends Partial<Position>,
    Partial<Size>,
    Partial<Collidable> {
  angle?: Angle;
}

export interface RectangleProps {
  collisionMode?: "target" | "colisor";
  data?: SharedValue<RectangleData> | RectangleData;
  style?: AnimatedProps<"View">["style"];
}

const initialValues: Required<RectangleData> = {
  x: 0,
  y: 0,
  angle: 0,
  width: 50,
  height: 100,
  collidable: true,
};

export default function Rectangle({
  data,
  collisionMode = "colisor",
  style,
}: RectangleProps) {
  const collisionID = useRef(-1);
  const { addObject, updateObject, removeObject } = useCollisionSystem();

  const derivedData = useDerivedValue<Required<RectangleData>>(() => {
    let entries: Entries<RectangleData> = [];

    if (data) {
      if ("value" in data) {
        entries = Object.entries(data.value) as Entries<RectangleData>;
      } else {
        entries = Object.entries(data) as Entries<RectangleData>;
      }
    }

    return entries.reduce<Required<RectangleData>>((prev, data) => {
      if (data && typeof data[1] !== "undefined") {
        return { ...prev, [data[0]]: data[1] };
      }
      return prev;
    }, initialValues);
  });

  const animatedStyle = useAnimatedStyle(() => ({
    width: derivedData.value.width,
    height: derivedData.value.height,
    top: derivedData.value.y,
    left: derivedData.value.x,
    transform: [{ rotate: derivedData.value.angle + "deg" }],
  }));

  useAnimatedReaction(
    () => derivedData.value,
    (curr, prev) => {
      if (curr !== prev) {
        updateObject(collisionID.current, curr, collisionMode);
      }
    },
  );

  useEffect(() => {
    if (collisionID.current === -1) {
      collisionID.current = addObject(derivedData.value, collisionMode);
    }

    return () => {
      if (collisionID.current !== -1) {
        removeObject(collisionID.current, collisionMode);
      }
    };
  }, [collisionMode]);

  return (
    <Animated.View
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
