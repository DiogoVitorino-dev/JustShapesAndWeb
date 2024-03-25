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
import { AnimatedStyleApp, Diameter, Position } from "@/constants/commonTypes";
import { useCollisionSystem } from "@/hooks";
import type {
  ForceRemoveCollidableObject,
  Collidable,
} from "@/scripts/collision/collisionSystemProvider";

export interface CircleData extends Partial<Position>, Partial<Collidable> {
  diameter?: Diameter;
}

export interface CircleProps {
  data?: SharedValue<CircleData> | CircleData;
  collisionMode?: "target" | "object";
  style?: AnimatedStyleApp;
}

const initialValues: Required<CircleData> = {
  diameter: 50,
  x: 0,
  y: 0,
  collidable: {
    enabled: false,
  },
};
type RemoveListeners = { collision: () => void };

export default function Circle({ data, collisionMode, style }: CircleProps) {
  const [removeListeners, setRemoveListeners] = useState<RemoveListeners>();
  const { addObject, addTarget } = useCollisionSystem();

  const derivedData = useDerivedValue<Required<CircleData>>(() => {
    const { diameter, x, y, collidable } = initialValues;
    if (data && "value" in data) {
      return {
        diameter: data.value.diameter || diameter,
        x: data.value.x || x,
        y: data.value.y || y,
        collidable: data.value.collidable || collidable,
      };
    }
    return {
      diameter: data?.diameter || diameter,
      x: data?.x || x,
      y: data?.y || y,
      collidable: data?.collidable || collidable,
    };
  });

  const animatedStyle = useAnimatedStyle(() => ({
    width: derivedData.value.diameter,
    height: derivedData.value.diameter,
    top: derivedData.value.y,
    left: derivedData.value.x,
    borderRadius: derivedData.value.diameter / 2,
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
