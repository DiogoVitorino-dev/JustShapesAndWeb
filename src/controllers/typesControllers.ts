import { Position } from "@/constants/types";

export interface ControlData extends Position {
  angle: number;
}

export interface Dash {
  isDashing: boolean;
}
