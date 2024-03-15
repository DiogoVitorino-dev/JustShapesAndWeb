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

import { RunnableAnimation, StylizedAnimation } from "../animations.type";

import { AnimatedStyleApp } from "@/constants/commonTypes";
import { useTimeoutValue } from "@/hooks";
import { MathUtils } from "@/utils/mathUtils";

export type ShakeImpact = "start" | "end" | "all";

export interface ShakeImpactDirection {
  /**
   * Sets the impact side to left (Start), right (End), or both sides (All).
   */
  horizontal?: ShakeImpact;
  /**
   * Sets the impact side to up (Start), down (End), or both sides (All).
   */
  vertical?: ShakeImpact;
}

export interface ShakeImpactConfig extends ShakeImpactDirection {
  /**
   * Multiplier that defines the frequency of impacts
   */
  frequency?: number;
}

export interface ShakeAnimation extends StylizedAnimation, RunnableAnimation {}

type ShakeAnimationProps = Required<Parameters<typeof useShakeAnimation>>;

const InitialShakeImpactConfig: Required<ShakeImpactConfig> = {
  frequency: 1,
  horizontal: "all",
  vertical: "all",
};

const [InitialDuration, InitialAmount, InitialImpact]: ShakeAnimationProps = [
  200,
  20,
  InitialShakeImpactConfig,
];
/**
 *
 * @param duration Duration of the entire animation.
 * @param amount The maximum value that will determine how much the impact will displace, in pixels.
 * @param impact Setting for the impacts.
 * @returns An `animatedStyle` and `run` function to start the animation. Note: `run` function also returns the `animatedStyle`.
 */

export function useShakeAnimation(
  duration: number = InitialDuration,
  amount: number = InitialAmount,
  impact: ShakeImpactConfig = InitialImpact,
): ShakeAnimation {
  const shakeY = useSharedValue(0);
  const shakeX = useSharedValue(0);
  const timer = useTimeoutValue(duration);
  impact = { ...InitialImpact, ...impact };

  const animatedStyle: AnimatedStyleApp = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }, { translateY: shakeY.value }],
  }));

  const run = () => {
    if (timer.value) {
      const springConfig: WithSpringConfig = {
        duration: duration / 2,
        dampingRatio: 2,
      };

      const timingConfig: WithTimingConfig = {
        duration: duration / 2,
        easing: Easing.in(Easing.bounce),
      };

      const repeating = setInterval(() => {
        shakeY.value = withSequence(
          withSpring(selectDirection(impact.vertical), springConfig),
          withTiming(0, timingConfig),
        );

        shakeX.value = withSequence(
          withSpring(selectDirection(impact.horizontal), springConfig),
          withTiming(0, timingConfig),
        );
      }, duration / impact!.frequency!);

      timer.run();
      setTimeout(() => {
        clearInterval(repeating);
      }, duration);
    }

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
