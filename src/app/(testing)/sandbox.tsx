import { useEffect } from "react";
import { ColorValue, StyleSheet } from "react-native";
import { useAnimatedStyle, useSharedValue } from "react-native-reanimated";

import { AnimatedAttacks } from "@/animations/attacks";
import { AnimatedEffects } from "@/animations/effects";
import ControllablePlayer from "@/components/game/controllablePlayer";
import { View } from "@/components/shared";
import { useCollisionSystem } from "@/hooks";
import Circle, { CircleData } from "@/models/geometric/circle";

export default function Sandbox() {
  const { collided } = useCollisionSystem();
  const circleData: CircleData = {
    x: 200,
    y: 100,
    diameter: 100,
  };

  const backgroundColor = useSharedValue<ColorValue>("tomato");

  useEffect(() => {
    backgroundColor.value = collided ? "indigo" : "tomato";
  }, [collided]);

  const backgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: backgroundColor.value,
  }));

  return (
    <View style={styles.container}>
      <AnimatedEffects.Flash
        start
        intensity={10}
        numbersOfReps={-1}
        duration={200}
        delayOfReps={1800}
      >
        <AnimatedEffects.Shake start={false} style={[styles.container]}>
          <AnimatedAttacks.RectangleSmash start />
          <AnimatedAttacks.Grenade
            x={500}
            y={150}
            numbersOfReps={-1}
            duration={2000}
            distance={1000}
            fragments={20}
            start
          />
          <AnimatedAttacks.Grenade
            x={800}
            y={300}
            numbersOfReps={-1}
            duration={2000}
            distance={1000}
            fragments={20}
            start
          />

          <Circle data={circleData} style={backgroundStyle} />
        </AnimatedEffects.Shake>

        <ControllablePlayer />
      </AnimatedEffects.Flash>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
