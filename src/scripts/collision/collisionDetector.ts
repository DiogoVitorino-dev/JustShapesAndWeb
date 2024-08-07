import { SATVerification, SAT, SATCircle, SATRectangle } from "./SAT";

export interface Collidable {
  /**
   * Enable and disable collision
   */
  collidable?: boolean;
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
        const verification = target?.collidable ? verifyTarget(target) : null;

        if (verification)
          return objects.some((object) =>
            object?.collidable ? verifyObject(object, verification) : false,
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
