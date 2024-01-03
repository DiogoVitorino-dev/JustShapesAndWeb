import {
  Easing,
  WithSpringConfig,
  WithTimingConfig,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { AnimatedStyleApp } from "@/constants/types";
import { MathUtils } from "@/scripts/utils/mathUtils";

export type ShakeImpact = "start" | "end" | "all";

export interface ShakeImpactDirection {
  horizontal?: ShakeImpact;
  vertical?: ShakeImpact;
}

export interface ShakeImpactConfig extends ShakeImpactDirection {
  duration?: number;
}

export interface ShakeAnimation {
  animatedStyle: AnimatedStyleApp;
  run: () => { animatedStyle: AnimatedStyleApp };
}

export function useShakeAnimation(
  duration = 200,
  amount = 100,
  impact?: ShakeImpactConfig,
): ShakeAnimation {
  const shakeY = useSharedValue(0);
  const shakeX = useSharedValue(0);

  const animatedStyle: AnimatedStyleApp = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }, { translateY: shakeY.value }],
  }));

  const run = () => {
    const springConfig: WithSpringConfig = {
      duration: (impact?.duration || 300) / 2,
      dampingRatio: 2,
    };

    const timingConfig: WithTimingConfig = {
      duration: (impact?.duration || 300) / 2,
      easing: Easing.in(Easing.bounce),
    };

    const repeating = setInterval(
      () => {
        shakeY.value = withSequence(
          withSpring(selectDirection(impact?.vertical), springConfig),
          withTiming(0, timingConfig),
        );

        shakeX.value = withSequence(
          withSpring(selectDirection(impact?.horizontal), springConfig),
          withTiming(0, timingConfig),
        );
      },
      impact?.duration || 300,
    );

    setTimeout(() => {
      clearInterval(repeating);
    }, duration);

    return { animatedStyle };
  };

  const selectDirection = (direction: ShakeImpact = "all") => {
    const { random } = MathUtils;

    switch (direction) {
      case "start":
        return random(0, amount * -1);

      case "end":
        return random(0, amount);

      default:
        return random(amount * -1, amount);
    }
  };

  return { animatedStyle, run };
}
