import React, { useState } from "react";
import { Button, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { AnimatedEffects } from "@/animations/effects";

export default function AnimationShakerChamber() {
  const [start, setStart] = useState(false);
  const moveObject = useSharedValue(300);
  const moveStyle = useAnimatedStyle(() => ({
    left: withRepeat(withTiming(moveObject.value, { duration: 500 }), -1, true),
  }));

  const run = () => {
    setStart((prev) => !prev);
  };

  moveObject.value = 500;
  return (
    <AnimatedEffects.Shake
      start={start}
      duration={500}
      amount={20}
      impact={{ frequency: 3 }}
      style={[styles.container]}
    >
      <Animated.View style={[styles.feedbackObject, moveStyle]} />
      <Button title="run Animation" onPress={run} />
    </AnimatedEffects.Shake>
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
