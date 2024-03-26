import { SharedValue } from "react-native-reanimated";

import { Diameter, Position, Size } from "@/constants/commonTypes";

export interface MovementSpeed {
  speedY: number;
  speedX: number;
}

export interface MovableObject extends Position, MovementSpeed {
  size: Size | Diameter;
  ignoreSceneLimits?: boolean;
}

type Mutate<Type> = { -readonly [Property in keyof Type]: Type[Property] };

export type AnimatedMoveableObject = Mutate<SharedValue<MovableObject>>;
