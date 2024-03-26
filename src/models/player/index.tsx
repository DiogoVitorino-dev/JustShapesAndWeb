import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import {
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";

import { AnimationPlayer } from "@/animations/player";
import { AnimatedView } from "@/components/shared";
import Colors from "@/constants/Colors";
import type {
  Angle,
  AnimatedStyleApp,
  Position,
  Size,
} from "@/constants/commonTypes";
import { useCollisionSystem } from "@/hooks";
import type {
  Collidable,
  CollidableRectangle,
} from "@/scripts/collision/collisionSystemProvider";

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
  const size = useDerivedValue<Size>(() => ({
    width: data.value.width || 20,
    height: data.value.height || 20,
  }));

  const position = useDerivedValue<Position>(() => ({
    x: data.value.x || 0,
    y: data.value.y || 0,
  }));

  const angle = useDerivedValue<Angle>(() => data.value.angle || 0);

  const collidable = useDerivedValue<CollidableRectangle>(() => ({
    ...position.value,
    ...size.value,
    angle: angle.value,
    collidable: { enabled: true },
  }));

  useEffect(() => {
    const remove = addTarget(collidable);
    return () => {
      remove();
    };
  }, [addTarget]);

  const { animatedStyle } = AnimationPlayer.usePlayerMovementAnimation(
    position,
    angle,
  );

  const playerAnimatedStyle = useAnimatedStyle(() => ({
    width: size.value.width,
    height: size.value.height,
  }));

  return (
    <AnimatedView
      testID="playerModel"
      style={[animatedStyle, playerAnimatedStyle, styles.default, style]}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    backgroundColor: Colors.entity.player,
    borderRadius: 2,
    position: "absolute",
  },
});
