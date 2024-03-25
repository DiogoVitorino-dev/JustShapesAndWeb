import React, { createContext, useEffect, useMemo, useState } from "react";
import {
  SharedValue,
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
} from "react-native-reanimated";

import type { SATCircle, SATRectangle } from "./SAT";
import { collisionDetector } from "./collisionDetector";

export type ForceRemoveCollidableObject = () => void;

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

export type AddCollidableObject = (
  value: SharedValue<CollidableObjects>,
) => ForceRemoveCollidableObject;

export interface CollisionSystem {
  /**
   * Changes to `true` if any collision is happening
   */
  collided: boolean;
  /**
   * add a `target` to check the collision with the other `object` added through `addObject`
   * - `Param target` A value with the collidable property enabled that you want to check for collisions
   * - `Returns` A Function to force remove the `target` from Collision System. `NOTE:` If removed you will need to call `addTarget` again
   *
   *TIP: You can remove this object just by making the `collidable.enable` property false
   */
  addTarget: AddCollidableObject;

  /**
   * add a `object` to check the collision with the other `target` added through `addTarget`
   * - `Param object` A value with the collidable property enabled that you want to check for collisions
   * - `Returns` A Function to force remove the `object` from Collision System. `NOTE:` If removed you will need to call `addObject` again
   *
   *TIP: You can remove this object just by making the `collidable.enable` property false
   */
  addObject: AddCollidableObject;
}

export const CollisionSystemContext = createContext<CollisionSystem>({
  addObject: () => () => {},
  addTarget: () => () => {},
  collided: false,
});

interface CollisionSystemProviderProps {
  children: React.ReactNode;
}

export default function CollisionSystemProvider({
  children,
}: CollisionSystemProviderProps) {
  const [collided, setCollided] = useState(false);
  const [activeCollector, setActiveCollector] = useState(false);
  const targets = useSharedValue<CollidableObjects[]>([]);
  const objects = useSharedValue<CollidableObjects[]>([]);

  const pushToList = (
    list: SharedValue<CollidableObjects[]>,
    object: SharedValue<CollidableObjects>,
  ) => {
    "worklet";
    let index = 0;
    list.modify((mutateList: CollidableObjects[]) => {
      // if the object has more properties
      // Only the properties of the collidable objects will be pushed to the list

      // Circles
      if ("diameter" in object.value) {
        const { collidable, diameter, x, y } = object.value;
        index = mutateList.push({ collidable, diameter, x, y }) - 1;

        // Rectangle
      } else if ("width" in object.value && "height" in object.value) {
        const { collidable, angle, height, width, x, y } = object.value;
        index = mutateList.push({ collidable, angle, height, width, x, y }) - 1;
      }
      return mutateList;
    });
    return index;
  };

  const addListener = (
    index: number,
    list: SharedValue<CollidableObjects[]>,
    object: SharedValue<CollidableObjects>,
  ) => {
    "worklet";
    object.addListener(index, (value: CollidableObjects) => {
      // if the object has more properties
      // Only changes to the properties of collidable objects modify the list

      list.modify((list: CollidableObjects[]) => {
        let newValue: CollidableObjects = list[index];
        // Circle
        if ("diameter" in object.value) {
          const { collidable, diameter, x, y } = object.value;
          newValue = { collidable, diameter, x, y };

          // Rectangle
        } else if ("width" in object.value && "height" in object.value) {
          const { collidable, angle, height, width, x, y } = object.value;
          newValue = { collidable, angle, height, width, x, y };
        }

        if (newValue !== list[index]) {
          list[index] = newValue;
        }
        return list;
      });

      //If the object is deactivated, it will be removed
      if (!value.collidable.enabled) {
        runOnJS(setActiveCollector)(true);
        object.removeListener(index);
      }
    });
  };

  const forceRemoveObject = (
    index: number,
    list: SharedValue<CollidableObjects[]>,
    object: SharedValue<CollidableObjects>,
  ) => {
    "worklet";
    list.modify((listObjects: CollidableObjects[]) =>
      listObjects.filter((val, idx) => index !== idx),
    );
    object.removeListener(index);
  };

  const handleAdd = (
    list: SharedValue<CollidableObjects[]>,
    object: SharedValue<CollidableObjects>,
  ): ForceRemoveCollidableObject => {
    "worklet";
    const index = pushToList(list, object);

    addListener(index, list, object);
    return () => forceRemoveObject(index, list, object);
  };

  const garbageCollector = () => {
    "worklet";
    objects.modify((mutateList: CollidableObjects[]) => {
      return mutateList.filter((item) => item.collidable.enabled);
    });

    targets.modify((mutateList: CollidableObjects[]) => {
      return mutateList.filter((item) => item.collidable.enabled);
    });
  };

  const verifyCollision = runOnJS(
    async (targets: CollidableObjects[], objects: CollidableObjects[]) => {
      setCollided(await collisionDetector(targets, objects));
    },
  );

  const addTarget: AddCollidableObject = (target) => {
    "worklet";
    return handleAdd(targets, target);
  };

  const addObject: AddCollidableObject = (object) => {
    "worklet";
    return handleAdd(objects, object);
  };

  useEffect(() => {
    if (activeCollector) {
      garbageCollector();
      setActiveCollector(false);
    }
  }, [activeCollector]);

  useAnimatedReaction(
    () => {
      return { target: targets.value, object: objects.value };
    },
    (current, prev) => {
      if (current !== prev) {
        verifyCollision(current.target, current.object);
      }
    },
  );

  const value = useMemo(
    () => ({ addTarget, addObject, collided }),
    [collided, addTarget, addObject],
  );
  return (
    <CollisionSystemContext.Provider value={value}>
      {children}
    </CollisionSystemContext.Provider>
  );
}
