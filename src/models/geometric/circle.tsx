import React, { useEffect, useRef } from "react";
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
  Diameter,
  Entries,
  Position,
} from "@/constants/commonTypes";
import { useCollisionSystem } from "@/hooks";
import { Collidable } from "@/scripts/collision/collisionDetector";
import type { ForceRemoveCollidableObject } from "@/scripts/collision/collisionSystemProvider";

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
  const removeListeners = useRef<RemoveListeners>();
  const { addObject, addTarget } = useCollisionSystem();

  const derivedData = useDerivedValue<Required<CircleData>>(() => {
    let entries: Entries<CircleData> = [];

    if (data) {
      if ("value" in data) {
        entries = Object.entries(data.value) as Entries<CircleData>;
      } else {
        entries = Object.entries(data) as Entries<CircleData>;
      }
    }

    return entries.reduce<Required<CircleData>>((prev, data) => {
      if (data && typeof data[1] !== "undefined") {
        return { ...prev, [data[0]]: data[1] };
      }
      return prev;
    }, initialValues);
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
        runOnJS((collision: RemoveListeners["collision"]) => {
          removeListeners.current = { ...removeListeners.current, collision };
        })(forceRemover);
      }
    },
  );

  useEffect(
    () => () => {
      if (removeListeners.current)
        Object.values(removeListeners.current).forEach((remove) => {
          remove();
        });
    },
    [],
  );

  return (
    <Animated.View
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
