import React from "react";
import { ViewStyle } from "react-native";
import { useSharedValue } from "react-native-reanimated";

import AnalogicJoystick from "./directional/analogic";
import { ControlProp, Directional } from "../typesControllers";

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

  const handleOnMove = ({ angle, x, y }: JoystickData) => {
    "worklet";
    onMove({ angle, jumping: jump.value, x, y });
  };

  return <AnalogicJoystick onMove={handleOnMove} velocity={velocity} />;
}
