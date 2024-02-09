import { useWindowDimensions } from "react-native";
import { useFrameCallback } from "react-native-reanimated";

import { AnimatedMoveableObject } from "./movement.type";

import { Size } from "@/constants/commonTypes";

export type MovementSystem = (
  objects: AnimatedMoveableObject,
  isActive?: boolean,
) => { MovementResult: AnimatedMoveableObject };

export const useMovementSystem: MovementSystem = (objects, isActive = true) => {
  const window = useWindowDimensions();

  const getSize = (size: Size | number) => {
    "worklet";
    let width = 0;
    let height = 0;

    if (typeof size === "number") {
      width = size;
      height = size;
    } else {
      width = size.width;
      height = size.height;
    }
    return {
      width,
      height,
    };
  };

  const updatePositionX = (
    x: number,
    speed: number,
    width: number,
    ignoreLimits = false,
  ) => {
    "worklet";
    const newX = x + speed;

    if ((newX >= 0 && newX <= window.width - width) || ignoreLimits) {
      x = newX;
    }
    return x;
  };

  const updatePositionY = (
    y: number,
    speed: number,
    height: number,
    ignoreLimits = false,
  ) => {
    "worklet";
    const newY = y + speed;

    if ((newY >= 0 && newY <= window.height - height) || ignoreLimits) {
      y = newY;
    }
    return y;
  };

  const frameUpdater = () => {
    "worklet";
    Object.keys(objects).map(async (key) => {
      const { size, speedX, speedY, x, y, ignoreSceneLimits } =
        objects[key].value;

      const { height, width } = getSize(size);

      objects[key].value = {
        ...objects[key].value,
        x: updatePositionX(x, speedX, width, ignoreSceneLimits),
        y: updatePositionY(y, speedY, height, ignoreSceneLimits),
      };

      return objects[key];
    });
  };

  useFrameCallback(frameUpdater, true).setActive(isActive);

  return {
    MovementResult: objects,
  };
};
