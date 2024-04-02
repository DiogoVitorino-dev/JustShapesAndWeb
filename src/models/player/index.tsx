import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import {
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";

import { AnimatedPlayer } from "@/animations/player";
import { AnimatedView } from "@/components/shared";
import Colors from "@/constants/Colors";
import type {
  Angle,
  AnimatedStyleApp,
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

interface PlayerProps {
  data: SharedValue<PlayerData>;
  style?: AnimatedStyleApp;
}

export default function Player({ data, style }: PlayerProps) {
  const { addTarget } = useCollisionSystem();

  const scaleY = useSharedValue(1);
  const bounce = useSharedValue(1);

  const derivedData = useDerivedValue<Required<PlayerData>>(() => ({
    x: data.value.x || 0,
    y: data.value.y || 0,
    angle: data.value.angle || 0,
    width: data.value.width || 20,
    height: data.value.height || 20,
    collidable: data.value.collidable || { enabled: true },
  }));

  useEffect(() => {
    const remove = addTarget(derivedData);
    return () => {
      remove();
    };
  }, [addTarget]);

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

  const playerAnimatedStyle = useAnimatedStyle(() => ({
    width: derivedData.value.width,
    height: derivedData.value.height,
    top: derivedData.value.y,
    left: derivedData.value.x,
    transform: [
      { rotate: withSpring(derivedData.value.angle + "deg") },
      {
        scaleY: withSpring(scaleY.value, { stiffness: 500 }),
      },
      { scale: bounce.value },
    ],
  }));

  return (
    <AnimatedView
      testID="playerModel"
      style={[playerAnimatedStyle, styles.default, style]}
    >
      <AnimatedPlayer.PlayerMovementEffect data={derivedData} />
    </AnimatedView>
  );
}

const styles = StyleSheet.create({
  default: {
    backgroundColor: Colors.entity.player,
    borderRadius: 2,
    position: "absolute",
  },
});
