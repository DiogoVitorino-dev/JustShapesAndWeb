import React, { useEffect } from "react";
import {
  Easing,
  WithTimingConfig,
  cancelAnimation as cancel,
  runOnUI,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { Position } from "@/constants/commonTypes";
import Circle from "@/models/geometric/circle";
import { AnglesUtils } from "@/utils/angleUtils";

export interface GrenadeFragmentProps extends Partial<Position> {
  angleDirection: number;
  start?: boolean;
  size?: number;
  distance?: number;
  duration?: number;
  numbersOfReps?: number;
}

export default function GrenadeFragment({
  angleDirection,
  numbersOfReps = 1,
  size = 10,
  x = 0,
  y = 0,
  start,
  distance = 100,
  duration = 200,
}: GrenadeFragmentProps) {
  const position = useSharedValue<Position>({ x, y });
  const opacity = useSharedValue(0);
  const durationOpacity = duration / 8;

  const positionTiming: WithTimingConfig = {
    duration,
    easing: Easing.inOut(Easing.linear),
  };

  const endAnimation = runOnUI(() => {
    opacity.value = withTiming(0, { duration: durationOpacity }, (fin) => {
      if (fin) {
        position.value = { x, y };
      }
    });
  });

  const startAnimation = runOnUI(() => {
    const { getDistanceFromAngle } = AnglesUtils;
    const finalPosition = getDistanceFromAngle(angleDirection, distance, {
      ...position.value,
    });

    opacity.value = withTiming(1, { duration: durationOpacity });

    position.value = withRepeat(
      withTiming(finalPosition, positionTiming),
      numbersOfReps,
      false,
      (fin) => {
        if (fin) {
          endAnimation();
        }
      },
    );
  });

  const cancelAnimation = runOnUI(() => {
    cancel(position);
    cancel(opacity);
    endAnimation();
  });

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    if (start) {
      startAnimation();
    } else {
      cancelAnimation();
    }
  }, [start]);

  return <Circle position={position} diameter={size} style={animatedStyle} />;
}
