import { StyleSheet } from "react-native";
import { useSharedValue } from "react-native-reanimated";

import { View } from "@/components/Themed";
import Controller from "@/controllers";
import { ControlData } from "@/controllers/typesControllers";
import Player from "@/models/player";
import {
  MovableObject,
  useMovementSystem,
} from "@/scripts/systems/movementSystem";

export default function Sandbox() {
  const movementPlayer = useSharedValue<MovableObject>({
    x: 0,
    y: 0,
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
    console.log(jumping);
  };

  return (
    <View style={styles.container}>
      <Controller onMove={handleOnMove} velocity={2} />
      <Player position={MovementResult.movementPlayer} angle={anglePlayer} />
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
