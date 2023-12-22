import React from "react";
import { ViewStyle } from "react-native";

import AnalogicJoystick from "./analogic";
import { ControlData } from "../typesControllers";

export type ControlTypes = "analogic";

export interface JoystickData extends ControlData {}

export interface JoystickProp {
  size?: number;
  velocity?: number;
  onMove?: (data: JoystickData) => void;
  style?: ViewStyle;
}

interface JoystickControllerProp extends JoystickProp {
  controlType?: ControlTypes;
}

export default function Joystick(props: JoystickControllerProp) {
  return <AnalogicJoystick {...props} />;
}
