import React from "react";
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

import Colors from "@/constants/Colors";

type PlayerPosition = SharedValue<{
  x: number;
  y: number;
}>;

interface PlayerProps {
  position: PlayerPosition;
  size?: number;
  lookAngle: SharedValue<number>;
}

export default function Player({
  size = 20,
  lookAngle,
  position,
}: PlayerProps) {
  const PlayerAnim = useAnimatedStyle(() => ({
    top: position.value.y,
    left: position.value.x,
    transform: [{ rotate: lookAngle.value + "deg" }],
  }));

  return (
    <Animated.View
      testID="playerModel"
      style={[
        PlayerAnim,
        {
          width: size,
          height: size,
          backgroundColor: Colors["light"].tabIconSelected,
          borderRadius: 2,
          position: "absolute",
          borderTopColor: "tomato",
          borderTopWidth: 3,
        },
      ]}
    />
  );
}
