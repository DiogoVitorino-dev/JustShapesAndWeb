import React, { useState } from "react";
import { Button, StyleSheet } from "react-native";

import { AnimatedEffects } from "@/animations/effects";
import { AnimatedView } from "@/components/shared";

export default function AnimationFlashChamber() {
  const [start, setStart] = useState(false);

  const run = () => {
    setStart((prev) => !prev);
  };
  return (
    <AnimatedView style={[styles.container]}>
      <Button title="run Animation" onPress={run} />
      <AnimatedEffects.Flash
        start={start}
        numbersOfReps={-1}
        duration={200}
        delayOfReps={200}
      >
        <AnimatedView style={[styles.feedbackObject]}>
          <AnimatedEffects.Flash
            start={start}
            numbersOfReps={-1}
            color="cyan"
            duration={400}
            intensity={100}
            delayOfReps={320}
          />
        </AnimatedView>
      </AnimatedEffects.Flash>
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
    backgroundColor: "tomato",
    position: "absolute",
  },
});
