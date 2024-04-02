import { useEffect } from "react";
import { ColorValue, StyleSheet } from "react-native";
import {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";

import { AnimatedAttacks } from "@/animations/attacks";
import { AnimatedEffects } from "@/animations/effects";
import { View } from "@/components/shared";
import Controller from "@/controllers";
import { ControlData } from "@/controllers/controllers.type";
import { useCollisionSystem } from "@/hooks";
import Circle, { CircleData } from "@/models/geometric/circle";
import Player, { PlayerData } from "@/models/player";
import { MovableObject } from "@/scripts/movement/movement.type";
import useJump from "@/scripts/movement/useJump";
import { useMovementSystem } from "@/scripts/movement/useMovementSystem";

export default function Sandbox() {
  const movementPlayer = useSharedValue<MovableObject>({
    x: 50,
    y: 50,
    speedX: 0,
    speedY: 0,
    size: 20,
  });

  const anglePlayer = useSharedValue(0);
  const jumpPlayer = useSharedValue(false);

  useMovementSystem(movementPlayer);
  const { collided } = useCollisionSystem();

  const handleOnMove = async ({ angle, x, y, jumping }: ControlData) => {
    "worklet";

    movementPlayer.value = {
      ...movementPlayer.value,

      speedX: x,
      speedY: y,
    };
    anglePlayer.value = angle;
    jumpPlayer.value = jumping;
  };

  const runningJump = useJump(jumpPlayer, movementPlayer);

  const player = useDerivedValue<PlayerData>(
    () => ({
      angle: anglePlayer.value,
      width: 20,
      height: 20,
      collidable: { enabled: true, ignore: runningJump.value },
      x: movementPlayer.value.x,
      y: movementPlayer.value.y,
    }),
    [anglePlayer, movementPlayer, runningJump],
  );

  const circleData: CircleData = {
    x: 200,
    y: 100,
    diameter: 100,
    collidable: { enabled: true },
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
        <AnimatedEffects.Shake start={collided} style={[styles.container]}>
          <Player data={player} />

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

          <Circle data={circleData} style={[backgroundStyle]} />
        </AnimatedEffects.Shake>

        <Controller onMove={handleOnMove} velocity={2} />
      </AnimatedEffects.Flash>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
