import {
  runOnJS,
  useAnimatedReaction,
  useDerivedValue,
} from "react-native-reanimated";

import { SATShapes, SATVerification, SAT } from "./SAT";
import { AnimatedCollidableObject, CollidableObject } from "./collision.types";

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

export const useCollisionSystem: CollisionSystem = (
  callback,
  targets,
  objects,
) => {
  const objectsArray = useDerivedValue(
    () => objects.map((object) => object.value),
    [objects],
  );

  const targetsArray = useDerivedValue(
    () => targets.map((target) => target.value),
    [targets],
  );

  const verifyCollision: CollisionVerifyCollision = (
    targets = [],
    objects = [],
  ) => {
    return new Promise<void>((resolve) => {
      const collided = targets.some((target) => {
        const verification = target?.ignoreCollision
          ? null
          : verifyTarget(target);

        if (verification)
          return objects.some((object) =>
            object?.ignoreCollision
              ? false
              : verifyObject(object, verification),
          );
      });

      callback(collided);
      resolve();
    });
  };

  const verifyTarget: CollisionVerifyTarget = (target) => {
    const { verifyCircle, verifyRectangle } = SAT;

    switch (target.shape) {
      case SATShapes.CIRCLE:
        return verifyCircle(target);

      case SATShapes.RECTANGLE:
        return verifyRectangle(target);
    }

    return null;
  };

  const verifyObject: CollisionVerifyObject = (object, verification) => {
    switch (object.shape) {
      case SATShapes.CIRCLE:
        return verification.withCircle(object);

      case SATShapes.RECTANGLE:
        return verification.withRectangle(object);
    }

    return null;
  };

  useAnimatedReaction(
    () => ({ targets: targetsArray.value, objects: objectsArray.value }),
    (current, previous) => {
      if (JSON.stringify(current) !== JSON.stringify(previous)) {
        const { objects, targets } = current;
        runOnJS(verifyCollision)(targets, objects);
      }
    },
  );
};

export default useCollisionSystem;
