import { renderHook } from "@testing-library/react-native";
import { useSharedValue } from "react-native-reanimated";

import { MovementSpeed } from "@/scripts/movement/movement.type";
import useJump, { MovementJumpConfig } from "@/scripts/movement/useJump";

interface DirectionSpeed {
  up: MovementSpeed;
  down: MovementSpeed;
  left: MovementSpeed;
  right: MovementSpeed;
}

describe("useJump - Movement scripts tests", () => {
  const config: MovementJumpConfig = {
    cooldown: 2000,
    duration: 1000,
    multiplier: 2,
  };
  const directionSpeed: DirectionSpeed = {
    up: { speedX: 0, speedY: -10 },
    down: { speedX: 0, speedY: 10 },
    left: { speedX: -10, speedY: 0 },
    right: { speedX: 10, speedY: 0 },
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it.each([
    ["up", directionSpeed.up],
    ["down", directionSpeed.down],
  ])("Should jump %s", (_, inputSpeed) => {
    const jump = renderHook(() => useSharedValue(false));
    const speed = renderHook(() => useSharedValue<MovementSpeed>(inputSpeed));

    const hook = renderHook(() =>
      useJump(jump.result.current, speed.result.current, config),
    );

    jump.result.current.value = true;

    jest.advanceTimersByTime(500);
    expect(hook.result.current.value).toBeTruthy();
    expect(speed.result.current.value.speedY).toBe(inputSpeed.speedY * 2);

    jest.advanceTimersByTime(1500);
    expect(hook.result.current.value).toBeFalsy();
    expect(speed.result.current.value.speedY).toBe(0);
  });

  it.each([
    ["left", directionSpeed.left],
    ["right", directionSpeed.right],
  ])("Should jump to the %s", (_, inputSpeed) => {
    const jump = renderHook(() => useSharedValue(false));
    const speed = renderHook(() => useSharedValue<MovementSpeed>(inputSpeed));

    const hook = renderHook(() =>
      useJump(jump.result.current, speed.result.current, config),
    );

    jump.result.current.value = true;

    jest.advanceTimersByTime(500);
    expect(hook.result.current.value).toBeTruthy();
    expect(speed.result.current.value.speedX).toBe(inputSpeed.speedX * 2);

    jest.advanceTimersByTime(1500);
    expect(hook.result.current.value).toBeFalsy();
    expect(speed.result.current.value.speedX).toBe(0);
  });
});
