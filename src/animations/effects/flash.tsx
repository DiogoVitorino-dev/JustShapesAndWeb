import React, { useEffect } from "react";
import { ColorValue, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  cancelAnimation as cancel,
  runOnUI,
  runOnJS,
} from "react-native-reanimated";

import { AnimatedEffectProps, RunnableAnimation } from "../animations.type";

import Colors from "@/constants/Colors";

export interface FlashConfig {
  duration?: number;
  intensity?: number;
  color?: ColorValue;
  numbersOfReps?: number;
  delayOfReps?: number;
  delay?: number;
}

export interface FlashProps
  extends RunnableAnimation,
    AnimatedEffectProps,
    FlashConfig {}

type FlashEffect = (flash: FlashProps) => React.JSX.Element;

export const Flash: FlashEffect = ({
  color = Colors.effects.flash,
  delayOfReps = 0,
  delay = 0,
  intensity = 10,
  duration = 200,
  numbersOfReps = 0,
  start,
  onFinish,
  children,
  style,
  view,
}) => {
  intensity = intensity / 100;
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: color,
    opacity: opacity.value,
  }));

  const handleOnFinished = (finished?: boolean) => {
    "worklet";
    if (finished && onFinish) {
      runOnJS(onFinish)();
    }
  };

  const repeated = () => {
    if (delayOfReps) {
      opacity.value = withRepeat(
        withDelay(
          delayOfReps,
          withSequence(
            withTiming(intensity, { duration: duration / 2 }),
            withTiming(0, { duration: duration / 2 }),
          ),
        ),
        numbersOfReps,
        false,
        handleOnFinished,
      );
    } else {
      opacity.value = withRepeat(
        withSequence(
          withTiming(intensity, { duration: duration / 2 }),
          withTiming(0, { duration: duration / 2 }),
        ),
        numbersOfReps,
        false,
        handleOnFinished,
      );
    }
  };

  const startAnimation = () => {
    "worklet";

    const callback = (finished?: boolean) => {
      "worklet";
      if (finished) {
        if (numbersOfReps) repeated();
        else handleOnFinished(finished);
      }
    };

    if (delay) {
      opacity.value = withDelay(
        delay,
        withSequence(
          withTiming(intensity, { duration: duration / 2 }),
          withTiming(0, { duration: duration / 2 }, callback),
        ),
      );
    } else {
      opacity.value = withSequence(
        withTiming(intensity, { duration: duration / 2 }),
        withTiming(0, { duration: duration / 2 }, callback),
      );
    }
  };

  const cancelAnimation = () => {
    "worklet";
    cancel(opacity);
    opacity.value = 0;
  };

  useEffect(() => {
    if (start) {
      runOnUI(startAnimation)();
    }
    return () => {
      if (start) {
        runOnUI(cancelAnimation)();
      }
    };
  }, [start]);

  return (
    <Animated.View style={[styles.container, style]} {...view}>
      {children}
      <Animated.View
        testID="flashAnimation"
        style={[styles.flash, animatedStyle]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
  },
  flash: {
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: 10,
  },
});
