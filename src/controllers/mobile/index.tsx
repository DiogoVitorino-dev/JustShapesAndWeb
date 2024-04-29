import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { useAnimatedReaction, useSharedValue } from "react-native-reanimated";

import { AreaButton } from "./buttons";
import { AnalogicDirectional } from "./directional";
import {
  ControlData,
  ControlProp,
  Directional,
  Jumpable,
} from "../controllers.type";

import { View } from "@/components/shared";

export interface DirectionalData extends Directional {}
export interface DirectionalProps {
  size?: number;
  velocity?: number;
  onMove?: (data: DirectionalData) => void;
  containerStyle?: ViewStyle;
}

export interface ButtonData extends Jumpable {}
export interface ButtonProps {
  onPress?: (data: ButtonData) => void;
}

interface MobileControlProp extends ControlProp {}

export default function MobileControl({ onMove, velocity }: MobileControlProp) {
  const jump = useSharedValue<boolean>(false);
  const data = useSharedValue<DirectionalData>({ angle: 0, x: 0, y: 0 });

  const handleDirectional = (newData: DirectionalData) => {
    "worklet";
    data.value = newData;
  };

  const handleButtons = ({ jumping }: ButtonData) => {
    "worklet";
    jump.value = jumping;
  };

  useAnimatedReaction(
    (): ControlData => ({ jumping: jump.value, ...data.value }),
    (current, previous) => {
      if (JSON.stringify(current) !== JSON.stringify(previous)) {
        onMove(current);
      }
    },
  );

  return (
    <View style={styles.container}>
      <AnalogicDirectional onMove={handleDirectional} velocity={velocity} />
      <AreaButton onPress={handleButtons} />
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
