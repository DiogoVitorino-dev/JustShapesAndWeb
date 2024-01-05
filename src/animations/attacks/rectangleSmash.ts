import { useWindowDimensions } from "react-native";
import {
  Easing,
  WithTimingConfig,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { RunnableAnimation, StylizedAnimation } from "../animations.type";

import { RectangleSize } from "@/models/geometric/rectangle";

export type SmashDirection = "horizontal" | "vertical";

export interface RectangleSmashConfig {
  smashTo?: SmashDirection;
  prepareDuration?: number;
  prepareAmount?: number;
}
// values in ms
enum InitialValues {
  prepareDuration = 2000,
  prepareAmount = 70,
  attackDuration = 150,
}

export interface RectangleSmashAnimation
  extends RunnableAnimation,
    StylizedAnimation {}

export function useRectangleSmashAnimation(
  size: RectangleSize,
  smashConfig?: RectangleSmashConfig,
): RectangleSmashAnimation {
  const { width, height } = useWindowDimensions();
  const prepareValue =
    smashConfig?.prepareAmount || InitialValues.prepareAmount;

  const prepareTimingConfig: WithTimingConfig = {
    duration: smashConfig?.prepareDuration || InitialValues.prepareDuration,
    easing: Easing.out(Easing.ease),
  };

  const attackTimingConfig: WithTimingConfig = {
    duration: InitialValues.attackDuration,
    easing: Easing.exp,
  };

  const opacity = useSharedValue(0.5);

  const animatedStyle = useAnimatedStyle(() => ({
    width: size.value.width,
    height: size.value.height,
    opacity: opacity.value,
  }));

  const verticalAttack = () => {
    size.value = withTiming(
      {
        width: size.value.width,
        height: size.value.height + prepareValue,
      },
      prepareTimingConfig,
      (finished) => attack(finished),
    );

    function attack(ready?: boolean) {
      if (ready) {
        size.value = withTiming(
          { width: size.value.width, height },
          attackTimingConfig,
        );
      }
    }
  };

  const horizontalAttack = () => {
    opacity.value = 1;
    size.value = withTiming(
      {
        width: size.value.width + prepareValue,
        height: size.value.height,
      },
      prepareTimingConfig,
      (finished) => attack(finished),
    );

    function attack(ready?: boolean) {
      if (ready) {
        size.value = withTiming(
          { width, height: size.value.height },
          attackTimingConfig,
        );
      }
    }
  };

  const run = () => {
    switch (smashConfig?.smashTo) {
      case "vertical":
        verticalAttack();
        break;

      default:
        horizontalAttack();
        break;
    }

    return { animatedStyle };
  };

  return { animatedStyle, run };
}
