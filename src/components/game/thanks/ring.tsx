import React, { useEffect } from "react";
import Animated, {
  Easing,
  cancelAnimation,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { RunnableAnimation } from "@/animations/animations.type";
import Colors from "@/constants/Colors";
import { Position } from "@/constants/commonTypes";

interface RingProps extends RunnableAnimation, Partial<Position> {
  size?: number;
  duration?: number;
  borderWidth?: number;
  color?: string;
}

export default function Ring({
  start,
  onFinish,
  x = 0,
  y = 0,
  size = 100,
  duration = 1000,
  color = Colors.game.thanks.ring,
  borderWidth = 5,
}: RingProps) {
  const entryExitDuration = duration / 4;
  duration -= entryExitDuration;

  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  const startAnimation = () => {
    "worklet";
    opacity.value = withTiming(1, {
      duration: entryExitDuration,
      easing: Easing.out(Easing.ease),
    });
    scale.value = withTiming(
      1,
      { duration, easing: Easing.out(Easing.exp) },
      (fin) => (fin ? endAnimation() : undefined),
    );
  };

  const endAnimation = () => {
    "worklet";
    if (opacity.value !== 0) {
      opacity.value = withTiming(0, { duration: entryExitDuration }, (fin) => {
        if (fin) {
          scale.value = 0;
          if (onFinish) {
            runOnJS(onFinish)();
          }
        }
      });
    }
  };

  const cancel = () => {
    "worklet";
    cancelAnimation(opacity);
    cancelAnimation(scale);
    endAnimation();
  };

  useEffect(() => {
    if (start) {
      startAnimation();
    } else {
      cancel();
    }
  }, [start]);

  const animatedRing = useAnimatedStyle(() => ({
    width: size,
    height: size,
    left: x,
    top: y,
    borderRadius: size / 2,
    borderColor: color,
    transform: [{ scale: scale.value }],
    borderWidth,
    position: "absolute",
    opacity: opacity.value,
  }));
  return <Animated.View style={animatedRing} />;
}
