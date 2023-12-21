import { Platform, StyleSheet } from "react-native";
import { useSharedValue } from "react-native-reanimated";

import { View } from "@/components/Themed";
import Joystick, { JoystickData } from "@/controllers/joystick";
import Keyboard, { KeyboardData } from "@/controllers/keyboard";
import Player from "@/models/player";

export default function Sandbox() {
  const posPlayer = useSharedValue({ x: 0, y: 0 });
  const anglePlayer = useSharedValue(0);

  const handleOnMoveJoystick = ({ angle, x, y }: JoystickData) => {
    posPlayer.value = { x, y };
    anglePlayer.value = angle;
  };

  const handleOnMoveKeyboard = ({ angle, x, y, dash }: KeyboardData) => {
    posPlayer.value = { x, y };
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
      <Player position={posPlayer} lookAngle={anglePlayer} />
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
