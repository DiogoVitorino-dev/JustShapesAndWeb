import { useEffect } from "react";
import { useWindowDimensions } from "react-native";
import {
  Easing,
  WithTimingConfig,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import Rectangle, {
  RectangleData,
  RectangleProps,
} from "@/models/geometric/rectangle";

export type SmashDirection = "horizontal" | "vertical";

export interface RectangleSmashConfig {
  smashTo?: SmashDirection;
  prepareDuration?: number;
  prepareAmount?: number;
}

export interface RectangleSmashProps
  extends RectangleSmashConfig,
    RectangleProps {
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

  const size = useSharedValue({ width: 100, height: 80 });
  const rect = useDerivedValue<RectangleData>(() => ({
    ...size.value,
    collidable: { enabled: true },
  }));
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
    <Rectangle data={rect} style={[{ opacity }, style]} {...rectangleProps} />
  );
}
