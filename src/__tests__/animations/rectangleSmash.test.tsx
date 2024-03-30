import {
  act,
  renderHook,
  render,
  waitFor,
} from "@testing-library/react-native";
import { useWindowDimensions } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { getAnimatedStyle } from "react-native-reanimated/src/reanimated2/jestUtils";

import { Wrapper } from "../test-utils";

import { RectangleSmash } from "@/animations/attacks/rectangleSmash";
import { useCollisionSystem } from "@/hooks";
import Player, { PlayerData } from "@/models/player";
import CollisionSystemProvider from "@/scripts/collision/collisionSystemProvider";

describe("Rectangle Smash Attack - Animation tests", () => {
  const window = renderHook(() => useWindowDimensions());

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("Should run animation", async () => {
    const { getByTestId } = render(
      <RectangleSmash prepareDuration={100} start />,
    );

    let style!: Record<string, any>;

    await waitFor(() =>
      act(() => {
        jest.advanceTimersByTime(250);
        style = getAnimatedStyle(getByTestId("rectangleModel"));
      }),
    );

    expect(style.width).toBe(window.result.current.width);
  });

  it("Should increment the size value according to the quantity and preparation time", async () => {
    const { getByTestId } = render(
      <RectangleSmash
        initialWidth={100}
        prepareDuration={100}
        prepareAmount={100}
        start
      />,
    );

    const view = getByTestId("rectangleModel");

    let style!: Record<string, any>;

    await act(() => {
      jest.advanceTimersByTime(100);
      style = getAnimatedStyle(view);
    });

    expect(style.width).toBeCloseTo(200.5, 0);

    await act(() => {
      jest.advanceTimersByTime(200);
      style = getAnimatedStyle(view);
    });

    expect(style.width).toBe(window.result.current.width);
  });

  it("Should increment the size value according to the smash direction", async () => {
    const { getByTestId } = render(<RectangleSmash smashTo="vertical" start />);

    const view = getByTestId("rectangleModel");

    let style!: Record<string, any>;

    await act(() => {
      jest.runAllTimers();
      style = getAnimatedStyle(view);
    });

    expect(style.height).toBe(window.result.current.height);
  });

  it("Should have a different initial position and size", async () => {
    const initial = {
      width: 800,
      height: 500,
      x: 300,
      y: 600,
    };
    const { getByTestId } = render(
      <RectangleSmash
        initialWidth={initial.width}
        initialHeight={initial.height}
        x={initial.x}
        y={initial.y}
        prepareDuration={100}
        prepareAmount={100}
        start
      />,
    );

    const view = getByTestId("rectangleModel");

    let style = getAnimatedStyle(view);

    expect(style.width).toBe(initial.width);
    expect(style.height).toBe(initial.height);
    expect(style.left).toBe(initial.x);
    expect(style.top).toBe(initial.y);

    await act(() => {
      jest.runAllTimers();
      style = getAnimatedStyle(view);
    });

    expect(style.width).toBe(window.result.current.width);
    expect(style.height).toBe(initial.height);
    expect(style.left).toBe(initial.x);
    expect(style.top).toBe(initial.y);
  });

  it.each([
    ["Should collide", 500],
    ["Should not collide", 50],
  ])("%s with player", async (_, msToRun) => {
    const data = renderHook(() =>
      useSharedValue<PlayerData>({ width: 100, height: 100, x: 200, y: 0 }),
    );

    const wrapper: Wrapper = ({ children }) => (
      <CollisionSystemProvider>
        <RectangleSmash
          initialWidth={50}
          initialHeight={500}
          prepareAmount={20}
          prepareDuration={50}
          y={0}
          start
        />
        <Player data={data.result.current} />
        {children}
      </CollisionSystemProvider>
    );

    const system = renderHook(() => useCollisionSystem(), { wrapper });

    act(() => {
      jest.advanceTimersByTime(msToRun);
    }).then(
      (value) => {
        if (msToRun > 100) {
          expect(system.result.current.collided).toBeTruthy();
        } else {
          expect(system.result.current.collided).toBeFalsy();
        }

        return value;
      },
      (reason) => reason,
    );
  });
});
