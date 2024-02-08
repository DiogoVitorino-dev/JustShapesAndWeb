import React from "react";
import { Button, StyleSheet } from "react-native";
import {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { AnimationEffects } from "@/animations/effects";
import { AnimatedView } from "@/components/shared";

export default function AnimationShakerChamber() {
  const moveObject = useSharedValue(300);
  const moveStyle = useAnimatedStyle(() => ({
    left: withRepeat(withTiming(moveObject.value, { duration: 500 }), -1, true),
  }));

  const { useShakeAnimation } = AnimationEffects;
  const { animatedStyle, run } = useShakeAnimation(500, 20, { frequency: 3 });

  moveObject.value = 500;
  return (
    <AnimatedView style={[styles.container, animatedStyle]}>
      <AnimatedView style={[styles.feedbackObject, moveStyle]} />
      <Button title="run Animation" onPress={run} />
    </AnimatedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  feedbackObject: {
    width: 50,
    height: 50,
    top: 100,
    position: "absolute",
    backgroundColor: "tomato",
  },
});
