import React, { useEffect } from "react";
import Animated, {
  Easing,
  WithSpringConfig,
  WithTimingConfig,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { AnimationEffectProps, RunnableAnimation } from "../animations.type";

import { AnimatedStyleApp } from "@/constants/commonTypes";
import { useTimeoutUI } from "@/hooks";
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

export interface ShakeConfig {
  /**
   * Duration of the entire animation.
   */
  duration?: number;
  /**
   * The maximum value that will determine how much the impact will displace, in pixels.
   */
  amount?: number;
  /**
   * Setting for the impacts.
   */
  impact?: ShakeImpactConfig;
}

const InitialShakeImpactConfig: Required<ShakeImpactConfig> = {
  frequency: 1,
  horizontal: "all",
  vertical: "all",
};

export interface ShakeProps
  extends ShakeConfig,
    RunnableAnimation,
    AnimationEffectProps {}

type ShakeEffect = (props: ShakeProps) => React.JSX.Element;

export const Shake: ShakeEffect = ({
  amount = 200,
  duration = 20,
  impact = InitialShakeImpactConfig,
  start = false,
  view,
  children,
  onFinish,
  style,
}) => {
  const shakeY = useSharedValue(0);
  const shakeX = useSharedValue(0);
  const timer = useTimeoutUI(duration);
  impact = { ...InitialShakeImpactConfig, ...impact };

  const animatedStyle: AnimatedStyleApp = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }, { translateY: shakeY.value }],
  }));

  const run = () => {
    if (!timer.result.value) {
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
        if (onFinish) {
          onFinish();
        }
      }, duration);
    }
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

  useEffect(() => {
    if (start) {
      run();
    }
  }, [start]);

  return (
    <Animated.View style={[animatedStyle, style]} {...view}>
      {children}
    </Animated.View>
  );
};
