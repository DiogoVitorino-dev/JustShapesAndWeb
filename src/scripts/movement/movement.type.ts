import { SharedValue } from "react-native-reanimated";

import { Position, Size } from "@/constants/types";

export interface MovementSpeed {
  speedY: number;
  speedX: number;
}

export interface MovableObject extends Position, MovementSpeed {
  size: Size | number;
  ignoreSceneLimits?: boolean;
}

export type AnimatedMoveableObject = Record<string, SharedValue<MovableObject>>;
