import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import {
  SharedValue,
  runOnJS,
  useAnimatedReaction,
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
    const { x, y, angle, width, height, collidable } = initialValues;

    if (data && "value" in data) {
      return {
        x: data.value.x || x,
        y: data.value.y || y,
        angle: data.value.angle || angle,
        width: data.value.width || width,
        height: data.value.height || height,
        collidable: data.value.collidable || collidable,
      };
    }
    return {
      x: data?.x || x,
      y: data?.y || y,
      angle: data?.angle || angle,
      width: data?.width || width,
      height: data?.height || height,
      collidable: data?.collidable || collidable,
    };
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
