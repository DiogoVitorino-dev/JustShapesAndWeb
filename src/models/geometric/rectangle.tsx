import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  SharedValue,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";

import Colors from "@/constants/Colors";
import {
  AnimatedStyleApp,
  Position,
  Size,
  Angle,
  Entries,
} from "@/constants/commonTypes";
import { useCollisionSystem } from "@/hooks";
import { Collidable } from "@/scripts/collision/collisionDetector";
import type { ForceRemoveCollidableObject } from "@/scripts/collision/collisionSystemProvider";

export interface RectangleData
  extends Partial<Position>,
    Partial<Size>,
    Partial<Collidable> {
  angle?: Angle;
}

export interface RectangleProps {
  collisionMode?: "target" | "object";
  data?: SharedValue<RectangleData> | RectangleData;
  style?: AnimatedStyleApp;
}

const initialValues: Required<RectangleData> = {
  x: 0,
  y: 0,
  angle: 0,
  width: 50,
  height: 100,
  collidable: {
    enabled: false,
  },
};

type RemoveListeners = { collision: () => void };

export default function Rectangle({
  data,
  collisionMode,
  style,
}: RectangleProps) {
  const [removeListeners, setRemoveListeners] = useState<RemoveListeners>();
  const { addObject, addTarget } = useCollisionSystem();

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
    () => derivedData.value.collidable.enabled,
    (curr, prev) => {
      if (curr !== prev && curr) {
        let forceRemover: ForceRemoveCollidableObject;
        if (collisionMode === "target") {
          forceRemover = addTarget(derivedData);
        } else {
          forceRemover = addObject(derivedData);
        }
        runOnJS(setRemoveListeners)({ collision: forceRemover });
      }
    },
  );

  useEffect(
    () => () => {
      if (removeListeners)
        Object.values(removeListeners).forEach((remove) => {
          remove();
        });
    },
    [removeListeners],
  );

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
