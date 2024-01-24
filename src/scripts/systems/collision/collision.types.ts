import { SharedValue } from "react-native-reanimated";

import { SATCircle, SATRectangle, SATVerification } from "./SAT";

type ExtractProps<T> = T[keyof T];

type UnionObjects<T> = ExtractProps<{
  [Props in keyof T]: {
    shape: T[Props];
  } & T;
}>;

type AllCollidableObject = CollidableCircle | CollidableRectangle;

export interface CollidableRectangle extends SATRectangle {
  shape: "RECTANGLE";
}
export interface CollidableCircle extends SATCircle {
  shape: "CIRCLE";
}

export type CollidableObject = UnionObjects<AllCollidableObject>;
export type AnimatedCollidableObject = SharedValue<CollidableObject>;

export type CollisionCallback = (collided: boolean) => void;

export type CollisionSystem = (
  callback: CollisionCallback,
  targets: AnimatedCollidableObject[],
  objects: AnimatedCollidableObject[],
) => void;

export type CollisionVerifyObject = (
  object: CollidableObject,
  verification: SATVerification,
) => boolean | null;

export type CollisionVerifyTarget = (
  target: CollidableObject,
) => SATVerification | null;

export type CollisionVerifyCollision = (
  targets: CollidableObject[],
  objects: CollidableObject[],
) => Promise<void>;
