import React, { useEffect } from "react";
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
  style?: AnimatedProps<"View">["style"];
}

const initialValues: Required<PlayerData> = {
  x: 0,
  y: 0,
  angle: 0,
  width: 20,
  height: 20,
  collidable: { enabled: true },
};

export default function Player({ data, style }: PlayerProps) {
  const { addTarget } = useCollisionSystem();

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
    <Animated.View
      testID="playerModel"
      style={[playerAnimatedStyle, styles.default, style]}
    >
      <AnimatedPlayer.PlayerMovementEffect data={derivedData} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  default: {
    backgroundColor: Colors.entity.player,
    borderRadius: 2,
    position: "absolute",
  },
});
