import { Platform, StyleSheet } from "react-native";
import { useSharedValue } from "react-native-reanimated";

import { View } from "@/components/Themed";
import Joystick, { JoystickData } from "@/controllers/joystick";
import Keyboard, { KeyboardData } from "@/controllers/keyboard";
import Player from "@/models/player";
import { MovableObject, useMovementSystem } from "@/scripts/movementSystem";

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
    movementPlayer.value = {
      ...movementPlayer.value,
      velocityX: x,
      velocityY: y,
    };
    anglePlayer.value = angle;
  };

  const handleOnMoveKeyboard = ({ angle, x, y, dash }: KeyboardData) => {
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
        <Joystick
          onMove={handleOnMoveJoystick}
          velocity={3}
          style={{ bottom: 10, left: 35 }}
        />
      ) : (
        <Keyboard onMove={handleOnMoveKeyboard} />
      )}
      <Player
        position={MovementResult.movementPlayer}
        lookAngle={anglePlayer}
      />
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
