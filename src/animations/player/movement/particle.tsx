import React, { useEffect } from "react";
import { ColorValue } from "react-native";
import Animated, {
  Easing,
  cancelAnimation,
  runOnJS,
  runOnUI,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { RunnableAnimation } from "@/animations/animations.type";
import Colors from "@/constants/Colors";
import { Position } from "@/constants/commonTypes";

export interface ParticleConfig extends Partial<Position> {
  size?: number;
  distance?: number;
  duration?: number;
  color?: ColorValue;
}

interface ParticleProps extends ParticleConfig, RunnableAnimation {}

export default function Particle({
  x = 0,
  y = 0,
  distance = 50,
  duration = 500,
  size = 10,
  color = Colors.entity.player,
  start,
  onFinish,
}: ParticleProps) {
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    width: size,
    height: size,
    top: y,
    right: x,
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
    backgroundColor: color,
  }));

  const startAnimation = () => {
    "worklet";

    translateX.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(distance * -1, {
          duration,
          easing: Easing.inOut(Easing.linear),
        }),
      ),
      -1,
    );

    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 0 }),
        withTiming(0, { duration, easing: Easing.in(Easing.exp) }),
      ),
      -1,
    );
  };

  const cancel = () => {
    "worklet";
    cancelAnimation(opacity);
    opacity.value = withTiming(0, { duration: duration / 3 }, (fin) => {
      if (fin && onFinish) {
        runOnJS(onFinish)();
      }
    });
  };

  useEffect(() => {
    if (start) {
      runOnUI(startAnimation)();
    } else {
      runOnUI(cancel)();
    }
  }, [start]);

  return (
    <Animated.View style={animatedStyle} testID="PlayerMovementParticle" />
  );
}
