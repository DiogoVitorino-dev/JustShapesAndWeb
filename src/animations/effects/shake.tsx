import React, { useEffect } from "react";
import Animated, {
  Easing,
  WithSpringConfig,
  WithTimingConfig,
  cancelAnimation,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { AnimatedEffectProps, RunnableAnimation } from "../animations.type";

import { AnimatedStyleApp } from "@/constants/commonTypes";
import { MathUtils } from "@/utils/mathUtils";

export type ShakeImpact = "none" | "start" | "end" | "all";

export interface ShakeImpactDirection {
  /**
   * Sets the impact side to left (Start), right (End), both sides (All) or none.
   */
  horizontal?: ShakeImpact;
  /**
   * Sets the impact side to up (Start), down (End), both sides (All) or none.
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
  /**
   * Sets a delay for the effect to start
   */
  delay?: number;
}

const InitialShakeImpactConfig: Required<ShakeImpactConfig> = {
  frequency: 1,
  horizontal: "all",
  vertical: "all",
};

export interface ShakeProps
  extends ShakeConfig,
    RunnableAnimation,
    AnimatedEffectProps {}

type ShakeEffect = (props: ShakeProps) => React.JSX.Element;

export const Shake: ShakeEffect = ({
  amount = 20,
  delay = 0,
  duration = 200,
  impact = InitialShakeImpactConfig,
  start = false,
  view,
  children,
  onFinish,
  style,
}) => {
  const shakeY = useSharedValue(0);
  const shakeX = useSharedValue(0);

  impact = { ...InitialShakeImpactConfig, ...impact };

  const shakeDuration = 80 / impact!.frequency!;

  const timingConfig: WithTimingConfig = {
    duration: shakeDuration,
    easing: Easing.out(Easing.ease),
  };

  const springConfig: WithSpringConfig = {
    stiffness: 200,
  };

  const animatedStyle: AnimatedStyleApp = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }, { translateY: shakeY.value }],
  }));

  const run = () => {
    let frequency = Number((duration / shakeDuration).toFixed(0)) - 1;

    const sequenceX: number[] = [];
    const sequenceY: number[] = [];

    while (frequency > 0) {
      frequency--;

      sequenceY.push(
        withTiming(selectDirection(impact.vertical), timingConfig),
      );
      sequenceX.push(
        withTiming(selectDirection(impact.horizontal), timingConfig),
      );

      if (frequency === 0) {
        sequenceX.push(withSpring(0, springConfig));
        sequenceY.push(
          withSpring(0, springConfig, (fin) =>
            fin && onFinish ? runOnJS(onFinish)() : undefined,
          ),
        );
      }
    }

    shakeY.value = withDelay(delay, withSequence(...sequenceY));
    shakeX.value = withDelay(delay, withSequence(...sequenceX));
  };

  const cancel = () => {
    cancelAnimation(shakeX);
    cancelAnimation(shakeY);
    shakeX.value = withSpring(0, springConfig);
    shakeY.value = withSpring(0, springConfig, (fin) =>
      fin && onFinish ? runOnJS(onFinish)() : undefined,
    );
  };
  const selectDirection = (direction: ShakeImpact = "all") => {
    const { random } = MathUtils;

    switch (direction) {
      case "start":
        return random(0, amount * -1);

      case "end":
        return random(0, amount);

      case "all":
        return random(amount * -1, amount);

      default:
        return 0;
    }
  };

  useEffect(() => {
    if (start) run();

    return () => {
      if (start) cancel();
    };
  }, [start]);

  return (
    <Animated.View style={[animatedStyle, style]} {...view}>
      {children}
    </Animated.View>
  );
};
