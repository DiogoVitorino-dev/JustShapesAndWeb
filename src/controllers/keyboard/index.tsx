import useKey from "@phntms/use-key";
import {
  SharedValue,
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { ControlData, Dash } from "../typesControllers";

import { AnglesUtils } from "@/scripts/utils/angleUtils";

export interface KeyboardData extends ControlData, Dash {}

interface KeyboardProps {
  velocity?: number;
  dashMultiplier?: number;
  dashDuration?: number;
  onMove?: (data: KeyboardData) => void;
}

export default function Keyboard({
  onMove,
  dashMultiplier = 2,
  dashDuration = 100,
  velocity = 3,
}: KeyboardProps) {
  const up = useSharedValue(0);
  const down = useSharedValue(0);
  const left = useSharedValue(0);
  const right = useSharedValue(0);
  const dash = useSharedValue(1);

  const increaseOnKeypress = (animV: SharedValue<number>, pressed: boolean) => {
    "worklet";
    if (pressed) {
      animV.value = velocity;
    } else {
      animV.value = 0;
    }
  };

  const decreaseOnKeypress = (animV: SharedValue<number>, pressed: boolean) => {
    "worklet";
    if (pressed) {
      animV.value = velocity * -1;
    } else {
      animV.value = 0;
    }
  };

  useKey("s", (pressed) => increaseOnKeypress(down, pressed));
  useKey("S", (pressed) => increaseOnKeypress(down, pressed));

  useKey("d", (pressed) => increaseOnKeypress(right, pressed));
  useKey("D", (pressed) => increaseOnKeypress(right, pressed));

  useKey("w", (pressed) => decreaseOnKeypress(up, pressed));
  useKey("W", (pressed) => decreaseOnKeypress(up, pressed));

  useKey("a", (pressed) => decreaseOnKeypress(left, pressed));
  useKey("A", (pressed) => decreaseOnKeypress(left, pressed));

  useKey(" ", (pressed) => {
    if (pressed) {
      dash.value = withTiming(
        dashMultiplier,
        { duration: dashDuration },
        (fin) => {
          if (fin) {
            dash.value = 1;
          }
        },
      );
    }
  });

  const limitDiagonalVelocity = (x: number, y: number) => {
    const distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

    // Limits like a circle's diagonal
    if (distance >= velocity) {
      const factor = velocity / distance;
      x *= factor;
      y *= factor;
    }

    return { x, y };
  };

  useAnimatedReaction(
    (): KeyboardData => {
      let { x, y } = limitDiagonalVelocity(
        right.value + left.value, // X = Left (negative values) + Right (positive values)
        up.value + down.value, // Y = Up (negative values) + Down (positive values)
      );

      x *= dash.value;
      y *= dash.value;

      return {
        x,
        y,
        angle: AnglesUtils.calculateAngle(x, y),
        isDashing: dash.value !== 1,
      };
    },
    (currentValue, previousValue) => {
      if (currentValue !== previousValue && onMove) {
        runOnJS(onMove)(currentValue);
      }
    },
  );

  return <></>;
}
