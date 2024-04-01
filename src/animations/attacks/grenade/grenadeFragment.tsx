import React, { useEffect } from "react";
import {
  Easing,
  WithTimingConfig,
  cancelAnimation as cancel,
  runOnJS,
  runOnUI,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { RunnableAnimation } from "@/animations/animations.type";
import { Position } from "@/constants/commonTypes";
import Circle, { CircleData } from "@/models/geometric/circle";
import { Collidable } from "@/scripts/collision/collisionDetector";
import { AnglesUtils } from "@/utils/angleUtils";

export interface GrenadeFragmentProps
  extends Partial<Position>,
    RunnableAnimation {
  angleDirection: number;
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
  onFinish,
  distance = 100,
  duration = 200,
}: GrenadeFragmentProps) {
  const position = useSharedValue<Position>({ x, y });
  const opacity = useSharedValue(0);
  const durationOpacity = duration / 8;

  const collision = useSharedValue<Collidable["collidable"]>({
    enabled: true,
    ignore: true,
  });

  const circle = useDerivedValue<CircleData>(() => ({
    ...position.value,
    diameter: size,
    collidable: { ...collision.value },
  }));

  const positionTiming: WithTimingConfig = {
    duration,
    easing: Easing.inOut(Easing.linear),
  };

  const endAnimation = runOnUI(() => {
    collision.value = { ...collision.value, ignore: true };

    opacity.value = withTiming(0, { duration: durationOpacity }, (fin) => {
      if (fin) {
        position.value = { x, y };
        if (onFinish) {
          runOnJS(onFinish)();
        }
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
    collision.value = { ...collision.value, ignore: false };
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

  return <Circle data={circle} style={animatedStyle} />;
}
