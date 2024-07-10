import React, { createContext, useMemo, useState } from "react";
import {
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
} from "react-native-reanimated";

import { CollidableObjects, collisionDetector } from "./collisionDetector";

export type CollidableType = "colisor" | "target";

export type AddCollidableObject = (
  value: CollidableObjects,
  type: CollidableType,
) => number;

export type UpdateCollidableObject = (
  id: number,
  newValues: CollidableObjects,
  type: CollidableType,
) => void;

export type RemoveCollidableObject = (id: number, type: CollidableType) => void;

export interface CollisionSystem {
  /**
   * Changes to `true` if any collision is happening
   */
  collided: boolean;
  addObject: AddCollidableObject;
  updateObject: UpdateCollidableObject;
  removeObject: RemoveCollidableObject;
}

export const CollisionSystemContext = createContext<CollisionSystem>({
  addObject: () => 0,
  updateObject: () => {},
  removeObject: () => {},
  collided: false,
});

interface CollisionSystemProviderProps {
  children: React.ReactNode;
}

export default function CollisionSystemProvider({
  children,
}: CollisionSystemProviderProps) {
  const [collided, setCollided] = useState(false);

  const target = useSharedValue<CollidableObjects[]>([]);
  const colisor = useSharedValue<CollidableObjects[]>([]);

  const verifyCollision = async (
    targets: CollidableObjects[],
    objects: CollidableObjects[],
  ) => {
    setCollided(await collisionDetector(targets, objects));
  };

  const addObject: AddCollidableObject = (value, type) => {
    let index = -1;

    switch (type) {
      case "colisor":
        index = colisor.value.length;
        colisor.value = [...colisor.value, value];
        break;

      case "target":
        index = target.value.length;
        target.value = [...target.value, value];
        break;
    }

    return index;
  };

  const updateObject: UpdateCollidableObject = (id, value, type) => {
    let aux = [];

    switch (type) {
      case "colisor":
        aux = colisor.value;
        aux[id] = value;
        colisor.value = [...aux];
        break;

      case "target":
        aux = target.value;
        aux[id] = value;
        target.value = [...aux];
        break;
    }
  };

  const removeObject: RemoveCollidableObject = (id, type) => {
    switch (type) {
      case "colisor":
        colisor.modify((list) => list.splice(id, 1));
        break;

      case "target":
        target.modify((list) => list.splice(id, 1));
        break;
    }
  };

  useAnimatedReaction(
    () => JSON.stringify(colisor.value) + JSON.stringify(target.value),
    (curr, prev) => {
      if (curr !== prev) {
        runOnJS(verifyCollision)(target.value, colisor.value);
      }
    },
  );

  const value = useMemo(
    () => ({ addObject, removeObject, updateObject, collided }),
    [collided, addObject, removeObject, updateObject],
  );
  return (
    <CollisionSystemContext.Provider value={value}>
      {children}
    </CollisionSystemContext.Provider>
  );
}
