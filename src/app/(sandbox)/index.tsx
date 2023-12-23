import { Platform, StyleSheet } from "react-native";
import { useSharedValue } from "react-native-reanimated";

import { View } from "@/components/Themed";
import Keyboard, { KeyboardData } from "@/controllers/keyboard";
import MobileController, { JoystickData } from "@/controllers/mobile";
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

  const handleOnMoveJoystick = ({ angle, x, y }: JoystickData) => {
    "worklet";
    movementPlayer.value = {
      ...movementPlayer.value,
      velocityX: x,
      velocityY: y,
    };
    anglePlayer.value = angle;
  };

  const handleOnMoveKeyboard = ({ angle, x, y, isDashing }: KeyboardData) => {
    movementPlayer.value = {
      ...movementPlayer.value,
      velocityX: x,
      velocityY: y,
    };
    anglePlayer.value = angle;
  };

  return (
    <View style={styles.container}>
      {Platform.OS === "ios" || Platform.OS === "android" ? (
        <MobileController
          onMove={handleOnMoveJoystick}
          velocity={2}
          style={{ bottom: 10, left: 35 }}
        />
      ) : (
        <Keyboard onMove={handleOnMoveKeyboard} />
      )}
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
