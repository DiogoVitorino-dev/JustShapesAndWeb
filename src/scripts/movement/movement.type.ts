import { SharedValue } from "react-native-reanimated";

import { Position, Size } from "@/constants/commonTypes";

export interface MovementSpeed {
  speedY: number;
  speedX: number;
}

export interface MovableObject extends Position, MovementSpeed {
  size: Size | number;
  ignoreSceneLimits?: boolean;
}

type Mutate<Type> = { -readonly [Property in keyof Type]: Type[Property] };

export type AnimatedMoveableObject = Mutate<SharedValue<MovableObject>>;
