import { ColorValue, StyleSheet, View } from "react-native";
import {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";

import { useRectangleSmashAnimation } from "@/animations/attacks/rectangleSmash";
import Controller from "@/controllers";
import { ControlData } from "@/controllers/controllers.type";
import Circle, {
  CirclePosition,
  CircleRadius,
} from "@/models/geometric/circle";
import Rectangle, {
  RectanglePosition,
  RectangleAngle,
  RectangleSize,
} from "@/models/geometric/rectangle";
import Player from "@/models/player";
import { useCollisionSystem } from "@/scripts/collision/useCollisionSystem";
import { AnimatedCollidableObject } from "@/scripts/collision/collision.types";
import { MovableObject, useMovementSystem } from "@/scripts/movement/useMovementSystem";

export default function Sandbox() {
  const movementPlayer = useSharedValue<MovableObject>({
    x: 50,
    y: 50,
    velocityX: 0,
    velocityY: 0,
  });
  const anglePlayer = useSharedValue(0);

  const { MovementResult } = useMovementSystem({ movementPlayer });

  const handleOnMove = ({ angle, x, y, jumping }: ControlData) => {
    "worklet";
    movementPlayer.value = {
      ...movementPlayer.value,
      velocityX: x,
      velocityY: y,
    };
    anglePlayer.value = angle;
  };

  const hitBoxPlayer: AnimatedCollidableObject = useDerivedValue(
    () => ({
      shape: "RECTANGLE",
      angle: anglePlayer.value,
      width: 20,
      height: 20,
      ...MovementResult.movementPlayer.value,
    }),
    [anglePlayer, MovementResult.movementPlayer],
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
  const rectAngle: RectangleAngle = useSharedValue(0);
  const rectSize: RectangleSize = useSharedValue({ height: 100, width: 100 });
  const backgroundColor = useSharedValue<ColorValue>("tomato");

  const smash = useRectangleSmashAnimation(rectSize, {
    prepareDuration: 2000,
    smashTo: "horizontal",
  }).run();

  const hitBoxRect: AnimatedCollidableObject = useDerivedValue(
    () => ({
      shape: "RECTANGLE",
      angle: rectAngle.value,
      ...rectSize.value,
      ...rectPosition.value,
    }),
    [rectPosition, rectSize, rectAngle],
  );

  useCollisionSystem(
    (collided) => {
      backgroundColor.value = collided ? "indigo" : "tomato";
    },
    [hitBoxPlayer],
    [hitBoxRect, hitBoxCircle],
  );

  const backgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: backgroundColor.value,
  }));

  return (
    <View style={styles.container}>
      <Player position={MovementResult.movementPlayer} angle={anglePlayer} />

      <Rectangle
        style={[smash.animatedStyle, backgroundStyle]}
        position={rectPosition}
        angle={rectAngle}
        size={rectSize}
      />

      <Circle
        position={circPosition}
        diameter={circSize}
        style={[backgroundStyle]}
      />

      <Controller onMove={handleOnMove} velocity={2} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
