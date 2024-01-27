import { SharedValue } from "react-native-reanimated";

import { SATCircle, SATRectangle } from "./SAT";

type MappedType<T> = {
  [Props in keyof T]: T[Props];
};

type AllCollidableObject = CollidableCircle | CollidableRectangle;

interface CollidableObjectProps {
  ignoreCollision?: boolean;
}

export interface CollidableRectangle
  extends SATRectangle,
    CollidableObjectProps {
  readonly shape: "RECTANGLE";
}
export interface CollidableCircle extends SATCircle, CollidableObjectProps {
  readonly shape: "CIRCLE";
}

export type CollidableObject = MappedType<AllCollidableObject>;

export type AnimatedCollidableObject = SharedValue<CollidableObject>;
