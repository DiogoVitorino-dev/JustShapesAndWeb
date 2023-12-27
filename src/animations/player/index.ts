import {
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { PlayerAngle, PlayerPosition } from "@/models/player";

const useAnimationMove = (position: PlayerPosition, angle: PlayerAngle) => {
  const scaleY = useSharedValue(1);
  const bounce = useSharedValue(1);

  const moveAnimatedStyle = useAnimatedStyle(() => ({
    top: position.value.y,
    left: position.value.x,
    transform: [
      { rotate: withSpring(angle.value + "deg", {}) },
      {
        scaleY: withSpring(scaleY.value, { stiffness: 500 }),
      },
      { scale: bounce.value },
    ],
  }));

  useAnimatedReaction(
    () => ({
      x: position.value.x,
      y: position.value.y,
    }),
    (current, previous) => {
      if (previous && JSON.stringify(current) !== JSON.stringify(previous)) {
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

  return moveAnimatedStyle;
};

export const AnimationPlayer = {
  useAnimationMove,
};
