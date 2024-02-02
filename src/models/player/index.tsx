import React from "react";
import { StyleSheet } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

import { AnimationPlayer } from "@/animations/player";
import Colors from "@/constants/Colors";
import {
  AnimatedAngle,
  AnimatedSize,
  AnimatedPosition,
  AnimatedStyleApp,
} from "@/constants/types";

export type PlayerSize = AnimatedSize;
export type PlayerPosition = AnimatedPosition;
export type PlayerAngle = AnimatedAngle;

interface PlayerProps {
  position: PlayerPosition;
  angle: PlayerAngle;
  size?: PlayerSize;
  style?: AnimatedStyleApp;
}

export default function Player({ size, angle, position, style }: PlayerProps) {
  const { animatedStyle } = AnimationPlayer.usePlayerMovementAnimation(
    position,
    angle,
  );

  const playerAnimatedStyle = useAnimatedStyle(() => ({
    width: size?.value.width || 20,
    height: size?.value.height || 20,
  }));

  return (
    <Animated.View
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
