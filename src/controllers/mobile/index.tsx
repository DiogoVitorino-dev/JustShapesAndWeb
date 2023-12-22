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

interface MobileControllerProp extends JoystickProp {
  controlType?: ControlTypes;
}

export default function MobileController(props: MobileControllerProp) {
  return <AnalogicJoystick {...props} />;
}
