import { StyleSheet } from "react-native";
import { useSharedValue } from "react-native-reanimated";

import Joystick from "@/components/Joystick";
import Player from "@/components/Player";
import { View } from "@/components/Themed";

export default function Sandbox() {
  const posPlayer = useSharedValue({ x: 0, y: 0 });
  const anglePlayer = useSharedValue(0);

  return (
    <View style={styles.container}>
      <Joystick
        onMove={({ angle, x, y }) => {
          posPlayer.value = {
            x: posPlayer.value.x + x,
            y: posPlayer.value.y + y,
          };
          anglePlayer.value = angle;
        }}
        velocity={3}
        style={{ bottom: 10, left: 35 }}
      />

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
