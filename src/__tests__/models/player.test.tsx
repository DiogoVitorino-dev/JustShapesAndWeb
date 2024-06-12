import { act, render, renderHook } from "@testing-library/react-native";
import { useSharedValue } from "react-native-reanimated";
import { getAnimatedStyle } from "react-native-reanimated/src/reanimated2/jestUtils";
import { CrashTestObject, CrashTestObjectData, Wrapper } from "test-utils";

import { useCollisionSystem } from "@/hooks";
import Player, { PlayerData } from "@/models/player";
import CollisionSystemProvider from "@/scripts/collision/collisionSystemProvider";

describe("Player - Model tests", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("Should move a model", () => {
    const data = renderHook(() =>
      useSharedValue<PlayerData>({
        x: 0,
        y: 0,
      }),
    );
    const { getByTestId } = render(<Player data={data.result.current} />);

    const view = getByTestId("playerModel");

    data.result.current.value = { x: 50, y: 100, angle: 90 };

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(view).toHaveAnimatedStyle({
      left: 50,
      top: 100,
    });
  });

  it("Should change angle", () => {
    const data = renderHook(() => useSharedValue<PlayerData>({ angle: 0 }));
    const { getByTestId } = render(<Player data={data.result.current} />);

    data.result.current.value = { angle: 90 };

    act(() => {
      jest.advanceTimersByTime(1500);
    });

    const style = getAnimatedStyle(getByTestId("playerModel"));

    expect(style.transform[0].rotate).toStrictEqual("90deg");
  });

  it("Should change size", () => {
    const data = renderHook(() =>
      useSharedValue<PlayerData>({ width: 50, height: 50 }),
    );
    const { getByTestId } = render(<Player data={data.result.current} />);

    data.result.current.value = { width: 100, height: 150 };

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    const style = getAnimatedStyle(getByTestId("playerModel"));

    expect(style.width).toBe(100);
    expect(style.height).toBe(150);
  });

  it("Should change the color of the player and particles", () => {
    const color = "#fff";
    const data = renderHook(() => useSharedValue<PlayerData>({}));
    const { getByTestId, getAllByTestId } = render(
      <Player data={data.result.current} color={color} />,
    );

    const modelStyle = getAnimatedStyle(getByTestId("playerModel"));
    const particlesStyle = getAnimatedStyle(
      getAllByTestId("PlayerMovementParticle")[0],
    );

    expect(modelStyle.backgroundColor).toBe(color);
    expect(particlesStyle.backgroundColor).toBe(color);
  });

  it.each([
    ["Should collide", 200],
    ["Should not collide", 100],
  ])("%s", async (_, x) => {
    const dataTestObject: CrashTestObjectData = { x: 300 };
    const data = renderHook(() =>
      useSharedValue<PlayerData>({ width: 100, height: 100, x: 0, y: 0 }),
    );

    const wrapper: Wrapper = ({ children }) => (
      <CollisionSystemProvider>
        <CrashTestObject data={dataTestObject} />
        <Player data={data.result.current} />
        {children}
      </CollisionSystemProvider>
    );

    const system = renderHook(() => useCollisionSystem(), { wrapper });

    act(() => {
      data.result.current.value = { ...data.result.current.value, x };
      jest.advanceTimersByTime(100);
    }).then(
      (value) => {
        if (x >= 200) {
          expect(system.result.current.collided).toBeTruthy();
        } else {
          expect(system.result.current.collided).toBeFalsy();
        }

        return value;
      },
      (reason) => reason,
    );
  });

  it.todo("should remove collision on unmount");
});
