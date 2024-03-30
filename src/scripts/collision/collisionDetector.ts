import { SATVerification, SAT, SATCircle, SATRectangle } from "./SAT";

export interface Collidable {
  collidable: {
    /**
     * Add and Remove the object from the Collision System. `NOTE:` If you only need to disable collision for a period of time, use `ignore` instead
     */
    enabled: boolean;
    /**
     * Makes the object ignore collisions
     */
    ignore?: boolean;
  };
}

export type CollidableCircle = SATCircle & Collidable;
export type CollidableRectangle = SATRectangle & Collidable;
export type CollidableObjects = CollidableRectangle | CollidableCircle;

export type CollisionDetector = (
  targets: CollidableObjects[],
  objects: CollidableObjects[],
) => Promise<boolean>;

export const collisionDetector: CollisionDetector = (targets, objects) =>
  new Promise((resolve) => {
    resolve(verifyCollision(targets, objects));

    function verifyCollision(
      targets: CollidableObjects[] = [],
      objects: CollidableObjects[] = [],
    ) {
      const collided = targets.some((target) => {
        const verification =
          target?.collidable.enabled && !target?.collidable.ignore
            ? verifyTarget(target)
            : null;

        if (verification)
          return objects.some((object) =>
            object?.collidable.enabled && !object?.collidable.ignore
              ? verifyObject(object, verification)
              : false,
          );
      });

      return collided;
    }

    function verifyTarget(target: CollidableObjects): SATVerification | null {
      const { verifyCircle, verifyRectangle } = SAT;

      if ("diameter" in target) {
        return verifyCircle(target);
      }

      return verifyRectangle(target);
    }

    function verifyObject(
      object: CollidableObjects,
      verification: SATVerification,
    ): boolean | null {
      if ("diameter" in object) {
        return verification.withCircle(object);
      }

      return verification.withRectangle(object);
    }
  });
