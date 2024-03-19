import { ColorValue, StyleSheet } from "react-native";
import {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";

import { AnimatedAttacks } from "@/animations/attacks";
import { AnimationEffects } from "@/animations/effects";
import { AnimatedView, View } from "@/components/shared";
import Controller from "@/controllers";
import { ControlData } from "@/controllers/controllers.type";
import Circle, {
  CirclePosition,
  CircleRadius,
} from "@/models/geometric/circle";
import { RectanglePosition } from "@/models/geometric/rectangle";
import Player from "@/models/player";
import { AnimatedCollidableObject } from "@/scripts/collision/collision.types";
import useCollisionSystem from "@/scripts/collision/useCollisionSystem";
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

  const hitBoxPlayer: AnimatedCollidableObject = useDerivedValue(
    () => ({
      shape: "RECTANGLE",
      angle: anglePlayer.value,
      width: 20,
      height: 20,
      ignoreCollision: runningJump.value,
      x: movementPlayer.value.x,
      y: movementPlayer.value.y,
    }),
    [anglePlayer, movementPlayer, runningJump],
  );

  const circPosition: CirclePosition = useSharedValue({ x: 200, y: 100 });
  const circSize: CircleRadius = useSharedValue(100);

  const hitBoxCircle: AnimatedCollidableObject = useDerivedValue(
    () => ({
      shape: "CIRCLE",
      diameter: circSize.value,
      ...circPosition.value,
    }),
    [circPosition, circSize],
  );

  const rectPosition: RectanglePosition = useSharedValue({ x: 500, y: 100 });
  const backgroundColor = useSharedValue<ColorValue>("tomato");

  const { animatedStyle, run } = AnimationEffects.useShakeAnimation();
  useCollisionSystem(
    (collided) => {
      backgroundColor.value = collided ? "indigo" : "tomato";
      if (collided) {
        run();
      }
    },
    [hitBoxPlayer],
    [hitBoxCircle],
  );

  const backgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: backgroundColor.value,
  }));

  return (
    <View style={styles.container}>
      <AnimatedView style={[styles.container, animatedStyle]}>
        <Player position={movementPlayer} angle={anglePlayer} />

        <AnimatedAttacks.RectangleSmash position={rectPosition} />

        <Circle
          position={circPosition}
          diameter={circSize}
          style={[backgroundStyle]}
        />
      </AnimatedView>

      <Controller onMove={handleOnMove} velocity={2} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
