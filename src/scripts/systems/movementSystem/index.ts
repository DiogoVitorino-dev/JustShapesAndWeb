import { SharedValue, useFrameCallback } from "react-native-reanimated";

import { Position } from "@/constants/types";

export interface MovableObject extends Position {
  velocityY: number;
  velocityX: number;
}

type AnimatedMoveableObject = Record<string, SharedValue<MovableObject>>;

interface MovementSystemData {
  MovementResult: AnimatedMoveableObject;
}

export function useMovementSystem(
  targets: AnimatedMoveableObject,
  isActive = true,
): MovementSystemData {
  useFrameCallback(() => {
    Object.keys(targets).map(async (key) => {
      targets[key].value = {
        ...targets[key].value,
        x: targets[key].value.x + targets[key].value.velocityX,
        y: targets[key].value.y + targets[key].value.velocityY,
      };
    });
  }, true).setActive(isActive);

  return {
    MovementResult: targets,
  };
}
