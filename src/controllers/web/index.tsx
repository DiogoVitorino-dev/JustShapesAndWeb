import {
  SharedValue,
  useAnimatedReaction,
  useSharedValue,
} from "react-native-reanimated";

import { ControlData, ControlProp } from "../controllers.type";

import { useAppSelector } from "@/store/hooks";
import { SettingsSelectors } from "@/store/reducers/settings/settingsSelectors";
import { AnglesUtils } from "@/utils/angleUtils";
import { ListenersUtils } from "@/utils/listenersUtils";

export interface KeyboardData extends ControlData {}

interface KeyboardProps extends ControlProp {}

export default function KeyboardControl({
  onMove,
  velocity = 3,
}: KeyboardProps) {
  const up = useSharedValue(0);
  const down = useSharedValue(0);
  const left = useSharedValue(0);
  const right = useSharedValue(0);
  const jumping = useSharedValue<boolean>(false);

  const { alternative, primary } = useAppSelector(
    SettingsSelectors.selectKeyboardSettings,
  ).keys;

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

  const { useKeyListener } = ListenersUtils.web;

  //DOWN
  useKeyListener(
    (pressed) => increaseOnKeypress(down, pressed),
    [primary.down, alternative.down],
  );

  //RIGHT
  useKeyListener(
    (pressed) => increaseOnKeypress(right, pressed),
    [primary.right, alternative.right],
  );

  // LEFT
  useKeyListener(
    (pressed) => decreaseOnKeypress(left, pressed),
    [primary.left, alternative.left],
  );

  // UP
  useKeyListener(
    (pressed) => decreaseOnKeypress(up, pressed),
    [primary.up, alternative.up],
  );

  //JUMP
  useKeyListener(
    (pressed) => {
      jumping.value = pressed;
    },
    [primary.jump, alternative.jump],
  );

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
      const { x, y } = limitDiagonalVelocity(
        right.value + left.value, // X = Left (negative values) + Right (positive values)
        up.value + down.value, // Y = Up (negative values) + Down (positive values)
      );

      return {
        x,
        y,
        jumping: jumping.value,
        angle: AnglesUtils.calculateAngle(x, y),
      };
    },
    (currentValue, previousValue) => {
      if (currentValue !== previousValue && onMove) {
        onMove(currentValue);
      }
    },
  );

  return <></>;
}
