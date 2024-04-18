import React, { useState } from "react";
import { Button, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

import { AnimatedAttacks } from "@/animations/attacks";

export default function AnimationBeamChamber() {
  const [start, setStart] = useState(false);

  const run = () => {
    setStart((prev) => !prev);
  };
  return (
    <Animated.View style={styles.container}>
      <Button title="run Animation" onPress={run} />
      <AnimatedAttacks.Beam start={start} y={100} />
    </Animated.View>
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
    backgroundColor: "tomato",
    position: "absolute",
  },
});
