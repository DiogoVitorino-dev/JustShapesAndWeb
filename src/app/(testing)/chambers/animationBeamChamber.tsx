import React, { useState } from "react";
import { Button, StyleSheet } from "react-native";

import { AnimatedAttacks } from "@/animations/attacks";
import { AnimatedView } from "@/components/shared";

export default function AnimationBeamChamber() {
  const [start, setStart] = useState(false);

  const run = () => {
    setStart((prev) => !prev);
  };
  return (
    <AnimatedView style={[styles.container]}>
      <Button title="run Animation" onPress={run} />
      <AnimatedAttacks.Beam start={start} y={100} />
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
