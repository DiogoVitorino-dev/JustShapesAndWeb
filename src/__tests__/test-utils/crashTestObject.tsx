import React, { useEffect } from "react";
import { Text } from "react-native";
import { SharedValue, useDerivedValue } from "react-native-reanimated";

import { Entries } from "@/constants/commonTypes";
import { useCollisionSystem } from "@/hooks";
import { CollidableRectangle } from "@/scripts/collision/collisionDetector";
import { ForceRemoveCollidableObject } from "@/scripts/collision/collisionSystemProvider";

export type CrashTestObjectMode = "target" | "object";
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
  collidable: {
    enabled: true,
  },
};

export function CrashTestObject({
  mode = "object",
  data,
}: CrashTestObjectProps) {
  const { collided, addObject, addTarget } = useCollisionSystem();

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

  useEffect(() => {
    let remover: ForceRemoveCollidableObject;

    if (mode === "target") {
      remover = addTarget(value);
    } else {
      remover = addObject(value);
    }

    return () => {
      remover();
    };
  }, []);

  return <Text>{collided ? "collided" : "don't collided"}</Text>;
}
