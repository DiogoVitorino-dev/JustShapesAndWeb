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
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { RunnableAnimation } from "@/animations/animations.type";
import { Diameter, Position } from "@/constants/commonTypes";
import Circle, { CircleData } from "@/models/geometric/circle";
import { AnglesUtils } from "@/utils/angleUtils";

export interface GrenadeFragmentProps
  extends Partial<Position>,
    RunnableAnimation {
  size?: Diameter;
  /**
   * @DocMissing
   */
  angleDirection: number;

  /**
   * @DocMissing
   */
  distance?: number;

  /**
   * @DocMissing
   */
  duration?: number;

  /**
   * @DocMissing
   */
  numbersOfReps?: number;

  /**
   * @DocMissing
   */
  delay?: number;

  /**
   * @DocMissing
   */
  delayOfReps?: number;
}

export default function GrenadeFragment({
  angleDirection,
  numbersOfReps = 0,
  size = 10,
  x = 0,
  y = 0,
  delay = 0,
  delayOfReps = 0,
  start,
  onFinish,
  distance = 100,
  duration = 200,
}: GrenadeFragmentProps) {
  const position = useSharedValue<Position>({ x, y });
  const opacity = useSharedValue(0);
  const durationOpacity = duration / 8;

  const collision = useSharedValue(false);

  const circle = useDerivedValue<CircleData>(() => ({
    ...position.value,
    diameter: size,
    collidable: collision.value,
  }));

  const positionTiming: WithTimingConfig = {
    duration,
    easing: Easing.inOut(Easing.linear),
  };

  const endAnimation = () => {
    "worklet";
    collision.value = false;

    opacity.value = withTiming(0, { duration: durationOpacity }, (fin) => {
      if (fin) {
        position.value = { x, y };
        if (onFinish) {
          runOnJS(onFinish)();
        }
      }
    });
  };

  const repeated = (final: Position) => {
    "worklet";
    const callback = (finished?: boolean) =>
      finished ? endAnimation() : undefined;

    position.value = { x, y };

    if (delayOfReps) {
      position.value = withRepeat(
        withDelay(delayOfReps, withTiming({ ...final }, positionTiming)),
        numbersOfReps,
        false,
        callback,
      );
    } else {
      position.value = withRepeat(
        withTiming({ ...final }, positionTiming),
        numbersOfReps,
        false,
        callback,
      );
    }
  };

  const startAnimation = runOnUI(() => {
    const { getDistanceFromAngle } = AnglesUtils;
    const finalPosition = getDistanceFromAngle(angleDirection, distance, {
      ...position.value,
    });

    const callback = (finished?: boolean) => {
      "worklet";
      if (finished) {
        if (numbersOfReps || numbersOfReps === -1) repeated(finalPosition);
        else endAnimation();
      }
    };

    if (delay) {
      opacity.value = withDelay(
        delay,
        withTiming(1, { duration: durationOpacity }),
      );

      position.value = withDelay(
        delay,
        withTiming(finalPosition, positionTiming, callback),
      );
    } else {
      opacity.value = withTiming(1, { duration: durationOpacity });
      position.value = withTiming(finalPosition, positionTiming, callback);
    }

    collision.value = true;
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
    }

    return () => {
      if (start) cancelAnimation();
    };
  }, [start]);

  return <Circle data={circle} style={animatedStyle} />;
}
