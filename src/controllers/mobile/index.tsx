import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { useAnimatedReaction, useSharedValue } from "react-native-reanimated";

import AreaButton from "./buttons/area";
import AnalogicJoystick from "./directional/analogic";
import { ControlData, ControlProp, Directional } from "../typesControllers";

interface MobileControlProp extends ControlProp {}

export interface JoystickData extends Directional {}

export interface JoystickProp {
  size?: number;
  velocity?: number;
  onMove?: (data: JoystickData) => void;
  containerStyle?: ViewStyle;
}

export default function MobileControl({ onMove, velocity }: MobileControlProp) {
  const jump = useSharedValue<boolean>(false);
  const data = useSharedValue<JoystickData>({ angle: 0, x: 0, y: 0 });

  const handleOnMove = (newData: JoystickData) => {
    "worklet";
    data.value = newData;
  };

  const handleOnJump = (pressed: boolean) => {
    "worklet";
    jump.value = pressed;
  };

  useAnimatedReaction(
    (): ControlData => ({ jumping: jump.value, ...data.value }),
    (current, previous) => {
      if (current !== previous) {
        onMove(current);
      }
    },
  );

  return (
    <View style={styles.container}>
      <AnalogicJoystick onMove={handleOnMove} velocity={velocity} />
      <AreaButton onPress={handleOnJump} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
});
