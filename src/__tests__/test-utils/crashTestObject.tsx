import React, { useEffect, useRef } from "react";
import { Text } from "react-native";
import {
  SharedValue,
  useAnimatedReaction,
  useDerivedValue,
} from "react-native-reanimated";

import { Entries } from "@/constants/commonTypes";
import { useCollisionSystem } from "@/hooks";
import { CollidableRectangle } from "@/scripts/collision/collisionDetector";
import { CollidableType } from "@/scripts/collision/collisionSystemProvider";

export type CrashTestObjectMode = CollidableType;
export type CrashTestObjectData = Partial<CollidableRectangle>;

export interface CrashTestObjectProps {
  data: CrashTestObjectData | SharedValue<CrashTestObjectData>;
  mode?: CrashTestObjectMode;
}

const initialValues: Required<CrashTestObjectData> = {
  x: 0,
  y: 0,
  angle: 0,
  width: 100,
  height: 100,
  collidable: true,
};

export function CrashTestObject({
  mode = "colisor",
  data,
}: CrashTestObjectProps) {
  const { collided, addObject, removeObject, updateObject } =
    useCollisionSystem();

  const id = useRef(0);

  const value = useDerivedValue<Required<CrashTestObjectData>>(() => {
    let entries: Entries<CrashTestObjectData> = [];

    if (data) {
      if ("value" in data) {
        entries = Object.entries(data.value) as Entries<CrashTestObjectData>;
      } else {
        entries = Object.entries(data) as Entries<CrashTestObjectData>;
      }
    }

    return entries.reduce<Required<CrashTestObjectData>>((prev, data) => {
      if (data && typeof data[1] !== "undefined") {
        return { ...prev, [data[0]]: data[1] };
      }
      return prev;
    }, initialValues);
  });

  useAnimatedReaction(
    () => value.value,
    (curr, prev) =>
      curr !== prev ? updateObject(id.current, curr, mode) : undefined,
  );

  useEffect(() => {
    id.current = addObject(value.value, mode);

    return () => {
      removeObject(id.current, mode);
    };
  }, []);

  return <Text>{collided ? "collided" : "don't collided"}</Text>;
}
