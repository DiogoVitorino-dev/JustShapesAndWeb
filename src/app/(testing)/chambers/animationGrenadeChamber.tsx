import React, { useState } from "react";
import { Button, StyleSheet } from "react-native";

import { AnimatedAttacks } from "@/animations/attacks";
import { AnimatedView } from "@/components/shared";

export default function AnimationGrenadeChamber() {
  const [boom, setBoom] = useState(false);
  return (
    <AnimatedView style={[styles.container]}>
      <AnimatedAttacks.Grenade
        x={200}
        y={670}
        start={boom}
        duration={4000}
        distance={800}
        fragments={10}
        numbersOfReps={5}
      />
      <AnimatedAttacks.Grenade
        x={400}
        y={400}
        start={boom}
        duration={4000}
        distance={800}
        fragments={10}
      />
      <AnimatedAttacks.Grenade
        x={600}
        y={100}
        start={boom}
        duration={4000}
        distance={800}
        fragments={10}
      />
      <AnimatedAttacks.Grenade
        x={800}
        y={600}
        start={boom}
        duration={4000}
        distance={800}
        fragments={10}
      />
      <Button
        title={boom ? "stop" : "boom"}
        onPress={() => {
          setBoom((prev) => !prev);
        }}
      />
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
