import { useEffect } from "react";
import { useWindowDimensions } from "react-native";
import {
  Easing,
  WithTimingConfig,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { AnimatedStyleApp, Position } from "@/constants/commonTypes";
import Rectangle, { RectangleData } from "@/models/geometric/rectangle";

export type SmashDirection = "horizontal" | "vertical";

export interface RectangleSmashConfig extends Partial<Position> {
  initialWidth?: number;
  initialHeight?: number;
  smashTo?: SmashDirection;
  prepareDuration?: number;
  prepareAmount?: number;
}

export interface RectangleSmashProps extends RectangleSmashConfig {
  start?: boolean;
  style?: AnimatedStyleApp;
}

export function RectangleSmash({
  initialWidth = 100,
  initialHeight = 80,
  prepareAmount = 70,
  prepareDuration = 2000,
  x = 0,
  y = 0,
  smashTo = "horizontal",
  start,
  style,
}: RectangleSmashProps) {
  const window = useWindowDimensions();
  const size = useSharedValue({ width: initialWidth, height: initialHeight });
  const rect = useDerivedValue<RectangleData>(() => ({
    ...size.value,
    x,
    y,
    collidable: { enabled: true },
  }));

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
          { width: size.value.width, height: window.height },
          attackTimingConfig,
        );
      }
    }

    opacity.value = 1;
    size.value = withTiming(
      {
        width: size.value.width,
        height: size.value.height + prepareAmount,
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
          { width: window.width, height: size.value.height },
          attackTimingConfig,
        );
      }
    }

    opacity.value = 1;
    size.value = withTiming(
      {
        width: size.value.width + prepareAmount,
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

  return <Rectangle data={rect} style={[{ opacity }, style]} />;
}
