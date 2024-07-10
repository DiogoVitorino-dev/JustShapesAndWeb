import React, { useState } from "react";
import { Button, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

import { AnimatedAttacks } from "@/animations/attacks";
import ControllablePlayer from "@/components/game/controllablePlayer";

export default function AnimationBeamChamber() {
  const [start, setStart] = useState(false);

  const run = () => setStart(true);

  const cancel = () => setStart(false);

  return (
    <Animated.View style={styles.container}>
      <AnimatedAttacks.Beam start={start} y={100} />
      <AnimatedAttacks.Beam start={start} direction="vertical" />
      <ControllablePlayer />
      <Button title="run Animation" onPress={run} />
      <Button title="cancel Animation" onPress={cancel} />
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
