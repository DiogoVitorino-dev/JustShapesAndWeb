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

    await waitFor(() =>
      act(() => {
        jest.advanceTimersByTime(250);
      }),
    );

    const style = getAnimatedStyle(getByTestId("rectangleModel"));
    expect(style.width).toBe(window.result.current.width);
  });

  it("Should increment the size value according to the quantity and preparation time", async () => {
    const { getByTestId } = render(
      <RectangleSmash
        initialLength={100}
        prepareDuration={100}
        prepareAmount={100}
        start
      />,
    );

    const view = getByTestId("rectangleModel");

    await act(() => {
      jest.advanceTimersByTime(100);
    });

    let style = getAnimatedStyle(view);
    expect(style.width).toBeCloseTo(200.5, 0);

    await act(() => {
      jest.advanceTimersByTime(200);
    });

    style = getAnimatedStyle(view);
    expect(style.width).toBe(window.result.current.width);
  });

  it("Should increment the size value according to the smash direction", async () => {
    const { getByTestId } = render(
      <RectangleSmash
        attackDuration={100}
        attackSpeed={100}
        prepareDuration={100}
        smashTo="vertical"
        start
      />,
    );

    await act(() => {
      jest.advanceTimersByTime(300);
    });

    const view = getByTestId("rectangleModel");
    const style = getAnimatedStyle(view);

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
        initialLength={initial.width}
        size={initial.height}
        x={initial.x}
        y={initial.y}
        prepareAmount={100}
        attackDuration={100}
        attackSpeed={100}
        prepareDuration={100}
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
      jest.advanceTimersByTime(300);
    });

    style = getAnimatedStyle(view);
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
          initialLength={50}
          size={500}
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

  it("Should call onFinish when the animation finishes", () => {
    const callback = jest.fn(() => {});

    render(<RectangleSmash prepareDuration={100} onFinish={callback} start />);

    act(() => {
      jest.runAllTimers();
    }).then(
      (value) => {
        expect(callback).toHaveBeenCalledTimes(1);
        return value;
      },
      (reason) => reason,
    );
  });

  it("Should perform attack with specified attack speed", async () => {
    const { getByTestId } = render(
      <RectangleSmash
        initialLength={100}
        prepareDuration={100}
        prepareAmount={100}
        attackSpeed={100}
        start
      />,
    );

    const view = getByTestId("rectangleModel");

    await act(() => {
      jest.advanceTimersByTime(200);
    });

    const style = getAnimatedStyle(view);
    expect(style.width).toBeCloseTo(window.result.current.width, 0);
  });

  it("Should remain visible after attack with specific duration", async () => {
    const { getByTestId } = render(
      <RectangleSmash
        prepareDuration={100}
        attackSpeed={100}
        attackDuration={500}
        start
      />,
    );

    const view = getByTestId("rectangleModel");

    await act(() => {
      jest.advanceTimersByTime(700);
    });

    let style = getAnimatedStyle(view);
    expect(style.width).toBeCloseTo(window.result.current.width, 0);

    await act(() => {
      jest.advanceTimersByTime(100);
    });

    style = getAnimatedStyle(view);
    expect(style.width).not.toBeCloseTo(window.result.current.width, 0);
  });

  it("Should hide the attack with a specific duration", async () => {
    const { getByTestId } = render(
      <RectangleSmash
        prepareDuration={100}
        attackSpeed={100}
        attackDuration={100}
        hideDuration={500}
        start
      />,
    );

    const view = getByTestId("rectangleModel");

    await act(() => {
      jest.advanceTimersByTime(300 + 499);
    });

    let style = getAnimatedStyle(view);
    expect(style.width).not.toBe(0);

    await act(() => {
      jest.advanceTimersByTime(1);
    });

    style = getAnimatedStyle(view);
    expect(style.width).toBe(0);
  });

  it("Should delay the animation", async () => {
    const { getByTestId } = render(
      <RectangleSmash prepareDuration={100} delay={50} start />,
    );

    const view = getByTestId("rectangleModel");

    await act(() => {
      jest.advanceTimersByTime(50);
    });

    let style = getAnimatedStyle(view);
    expect(style.width).toBe(0);

    await act(() => {
      jest.advanceTimersByTime(50);
    });

    style = getAnimatedStyle(view);
    expect(style.width).not.toBe(0);
  });
});
