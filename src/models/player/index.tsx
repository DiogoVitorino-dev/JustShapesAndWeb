import React from "react";
import Animated, { SharedValue } from "react-native-reanimated";

import { AnimationPlayer } from "@/animations/player";
import Colors from "@/constants/Colors";
import { Position } from "@/constants/types";

export type PlayerPosition = SharedValue<Position>;
export type PlayerAngle = SharedValue<number>;

interface PlayerProps {
  position: PlayerPosition;
  angle: PlayerAngle;
  size?: number;
}

export default function Player({ size = 20, angle, position }: PlayerProps) {
  const animatedMove = AnimationPlayer.useAnimationMove(position, angle);

  return (
    <Animated.View
      testID="playerModel"
      style={[
        animatedMove,
        {
          width: size,
          height: size,
          backgroundColor: Colors["light"].tabIconSelected,
          borderRadius: 2,
          position: "absolute",
          borderLeftColor: "tomato",
          borderLeftWidth: 3,
        },
      ]}
    />
  );
}
