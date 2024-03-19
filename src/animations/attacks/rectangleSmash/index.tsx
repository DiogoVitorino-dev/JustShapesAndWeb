import { useEffect } from "react";
import { useWindowDimensions } from "react-native";
import {
  Easing,
  WithTimingConfig,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import Rectangle, { RectangleProps } from "@/models/geometric/rectangle";

export type SmashDirection = "horizontal" | "vertical";

export interface RectangleSmashConfig {
  smashTo?: SmashDirection;
  prepareDuration?: number;
  prepareAmount?: number;
}

export interface RectangleSmashProps
  extends RectangleSmashConfig,
    Omit<RectangleProps, "size"> {
  start?: boolean;
}

export function RectangleSmash({
  prepareAmount = 70,
  prepareDuration = 2000,
  smashTo = "horizontal",
  start,
  style,
  ...rectangleProps
}: RectangleSmashProps) {
  const { width, height } = useWindowDimensions();
  const size = useSharedValue({ width: 600, height: 200 });
  const prepareValue = prepareAmount;

  const prepareTimingConfig: WithTimingConfig = {
    duration: prepareDuration,
    easing: Easing.out(Easing.ease),
  };

  const attackTimingConfig: WithTimingConfig = {
    duration: 150,
    easing: Easing.exp,
  };

  const opacity = useSharedValue(0.5);

  const verticalAttack = () => {
    function attack(ready?: boolean) {
      "worklet";
      if (ready) {
        size.value = withTiming(
          { width: size.value.width, height },
          attackTimingConfig,
        );
      }
    }

    opacity.value = 1;
    size.value = withTiming(
      {
        width: size.value.width,
        height: size.value.height + prepareValue,
      },
      prepareTimingConfig,
      (finished) => attack(finished),
    );
  };

  const horizontalAttack = () => {
    function attack(ready?: boolean) {
      "worklet";
      if (ready) {
        size.value = withTiming(
          { width, height: size.value.height },
          attackTimingConfig,
        );
      }
    }

    opacity.value = 1;
    size.value = withTiming(
      {
        width: size.value.width + prepareValue,
        height: size.value.height,
      },
      prepareTimingConfig,
      (finished) => attack(finished),
    );
  };

  const SMASH = () => {
    switch (smashTo) {
      case "vertical":
        verticalAttack();
        break;

      default:
        horizontalAttack();
        break;
    }
  };

  useEffect(() => {
    if (start) {
      SMASH();
    }
  }, [start]);

  return (
    <Rectangle size={size} style={[{ opacity }, style]} {...rectangleProps} />
  );
}
