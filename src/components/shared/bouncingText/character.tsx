import React, { useEffect } from "react";
import {
  runOnJS,
  runOnUI,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import {
  AnimatedStyledTextProps,
  AnimatedText,
  StyledTextProps,
} from "../Text";

import { RunnableAnimation } from "@/animations/animations.type";

export interface CharacterProps extends RunnableAnimation {
  /**
   * Hide text only when `start` is set to false
   */
  toggle?: boolean;
  children?: StyledTextProps["children"];
  index?: number;
  duration?: number;
  style?: AnimatedStyledTextProps["style"];
}

export default function Character({
  children,
  duration = 3000,
  index = 0,
  toggle = false,
  start,
  onFinish,
  style,
}: CharacterProps) {
  duration -= index * 100;

  const entryExitDuration = duration / 4;
  const delay = duration - entryExitDuration;

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-100);

  const startAnimation = runOnUI(() => {
    "worklet";
    opacity.value = withTiming(1, { duration: entryExitDuration / 2 });
    translateY.value = withSpring(0, {
      duration: entryExitDuration,
      stiffness: 200,
    });
  });

  const endAnimation = runOnUI(() => {
    "worklet";
    opacity.value = withTiming(0, { duration: entryExitDuration / 2 });
    translateY.value = withDelay(
      entryExitDuration,
      withTiming(-100, { duration: 0 }, (fin) =>
        fin && onFinish ? runOnJS(onFinish)() : undefined,
      ),
    );
  });

  useEffect(() => {
    if (start) {
      startAnimation();

      if (!toggle) {
        setTimeout(() => {
          endAnimation();
        }, delay);
      }
    } else if (toggle) {
      endAnimation();
    }
  }, [start]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));
  return (
    <AnimatedText.Title style={[animatedStyle, style]}>
      {children}
    </AnimatedText.Title>
  );
}
