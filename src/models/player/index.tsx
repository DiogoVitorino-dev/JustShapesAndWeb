import React, { useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";

import { AnimatedPlayer } from "@/animations/player";
import Colors from "@/constants/Colors";
import type {
  Angle,
  AnimatedProps,
  Entries,
  Position,
  Size,
} from "@/constants/commonTypes";
import { useCollisionSystem } from "@/hooks";
import type { Collidable } from "@/scripts/collision/collisionDetector";

export interface PlayerData
  extends Partial<Position>,
    Partial<Size>,
    Partial<Collidable> {
  angle?: Angle;
}

export interface PlayerProps {
  data: SharedValue<PlayerData>;
  color?: string;
  style?: AnimatedProps<"View">["style"];
}

const initialValues: Required<PlayerData> = {
  x: 0,
  y: 0,
  angle: 0,
  width: 20,
  height: 20,
  collidable: true,
};

export default function Player({
  data,
  color = Colors.entity.player,
  style,
}: PlayerProps) {
  const { addObject, updateObject, removeObject } = useCollisionSystem();
  const collisionID = useRef(-1);

  const scaleY = useSharedValue(1);
  const bounce = useSharedValue(1);

  const derivedData = useDerivedValue<Required<PlayerData>>(() => {
    let entries: Entries<PlayerData> = [];

    if (data) {
      entries = Object.entries(data.value) as Entries<PlayerData>;
    }

    return entries.reduce<Required<PlayerData>>((prev, data) => {
      if (data && typeof data[1] !== "undefined") {
        return { ...prev, [data[0]]: data[1] };
      }
      return prev;
    }, initialValues);
  });

  useEffect(() => {
    collisionID.current = addObject(derivedData.value, "target");

    return () => {
      removeObject(collisionID.current, "target");
    };
  }, []);

  useAnimatedReaction(
    () => `${derivedData.value.x} ${derivedData.value.y}`,
    (curr, prev) => {
      if (curr !== prev) {
        scaleY.value = 0.75;
      } else if (scaleY.value !== 1) {
        scaleY.value = 1;
        bounce.value = withSequence(
          withSpring(1),
          withSpring(1.1),
          withSpring(1),
        );
      }
    },
  );

  useAnimatedReaction(
    () => derivedData.value,
    (curr, prev) => {
      if (curr !== prev) {
        updateObject(collisionID.current, curr, "target");
      }
    },
  );

  const playerAnimatedStyle = useAnimatedStyle(() => ({
    width: derivedData.value.width,
    height: derivedData.value.height,
    top: derivedData.value.y,
    left: derivedData.value.x,
    backgroundColor: color,
    transform: [
      { rotate: withSpring(derivedData.value.angle + "deg") },
      {
        scaleY: withSpring(scaleY.value, { stiffness: 500 }),
      },
      { scale: bounce.value },
    ],
  }));

  return (
    <Animated.View
      testID="playerModel"
      style={[playerAnimatedStyle, styles.default, style]}
    >
      <AnimatedPlayer.PlayerMovementEffect
        data={derivedData}
        particle={{ color }}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  default: {
    borderRadius: 2,
    position: "absolute",
  },
});
