import {
  SharedValue,
  useAnimatedReaction,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { MovementSpeed } from "./movement.type";

type AnimatedIsJumping = SharedValue<boolean>;
type AnimatedMovementSpeed = SharedValue<MovementSpeed>;

export interface MovementJumpConfig {
  multiplier?: number;
  cooldown?: number;
  duration?: number;
}

export type MovementJump = (
  jumping: AnimatedIsJumping,
  speed: AnimatedMovementSpeed,
  config?: MovementJumpConfig,
) => AnimatedIsJumping;

const InitialValues: Required<MovementJumpConfig> = {
  cooldown: 100,
  multiplier: 10,
  duration: 200,
};

export const useJump: MovementJump = (jumping, speed, config) => {
  const speedX = useSharedValue(speed.value.speedX);
  const speedY = useSharedValue(speed.value.speedY);
  const running = useSharedValue(false);
  const isCooldown = useSharedValue(0);

  const multiplier = config?.multiplier || InitialValues.multiplier;
  const cooldown = config?.cooldown || InitialValues.cooldown;
  const duration = config?.duration || InitialValues.duration;

  const startCooldown = () => {
    "worklet";
    isCooldown.value = 1;
    isCooldown.value = withDelay(cooldown, withTiming(0, { duration: 0 }));
  };

  const finalizeJump = (finished?: boolean) => {
    "worklet";
    if (finished && running.value) {
      running.value = false;
      startCooldown();
    }
  };

  const jump = () => {
    "worklet";

    running.value = true;
    speedX.value = withSequence(
      withTiming(speed.value.speedX * multiplier, { duration: duration / 2 }),
      withTiming(0, { duration: duration / 2 }, finalizeJump),
    );

    speedY.value = withSequence(
      withTiming(speed.value.speedY * multiplier, { duration: duration / 2 }),
      withTiming(0, { duration: duration / 2 }, finalizeJump),
    );
  };

  const run = (jumping: boolean, running: boolean, cooldown: boolean) => {
    "worklet";
    if (!running) {
      if (jumping && !cooldown) {
        jump();
      } else {
        speedX.value = speed.value.speedX;
        speedY.value = speed.value.speedY;
      }
    }
  };

  useAnimatedReaction(
    () => ({
      jump: jumping.value,
      running: running.value,
      cooldown: isCooldown.value,
    }),
    (current, previous) => {
      if (JSON.stringify(current) !== JSON.stringify(previous)) {
        run(current.jump, current.running, current.cooldown === 1);
      }
    },
  );

  useAnimatedReaction(
    () => ({ x: speedX.value, y: speedY.value }),
    (current, previous) => {
      if (JSON.stringify(current) !== JSON.stringify(previous)) {
        speed.value = {
          ...speed.value,
          speedX: current.x,
          speedY: current.y,
        };
      }
    },
  );

  return running;
};

export default useJump;
