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
  Diameter,
  Entries,
  Position,
} from "@/constants/commonTypes";
import { useCollisionSystem } from "@/hooks";
import { Collidable } from "@/scripts/collision/collisionDetector";

export interface CircleData extends Partial<Position>, Partial<Collidable> {
  diameter?: Diameter;
}

export interface CircleProps {
  data?: SharedValue<CircleData> | CircleData;
  collisionMode?: "target" | "colisor";
  style?: AnimatedProps<"View">["style"];
}

const initialValues: Required<CircleData> = {
  diameter: 50,
  x: 0,
  y: 0,
  collidable: true,
};

export default function Circle({
  data,
  collisionMode = "colisor",
  style,
}: CircleProps) {
  const collisionID = useRef(-1);
  const { addObject, updateObject, removeObject } = useCollisionSystem();

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
