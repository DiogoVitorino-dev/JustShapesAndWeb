import { Angle, Position } from "@/constants/commonTypes";

export interface Directional extends Position {
  angle: Angle;
}

export interface Jumpable {
  jumping: boolean;
}

export interface ControlData extends Directional, Jumpable {}

export interface ControlProp {
  onMove: (data: ControlData) => void;
  velocity?: number;
}
