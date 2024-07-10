import { act, render, waitFor } from "@testing-library/react-native";
import { getAnimatedStyle } from "react-native-reanimated/src/reanimated2/jestUtils";

import { Grenade } from "@/animations/attacks/grenade";

describe("Grenade Attack - Animation tests", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("Should run animation", async () => {
    const { queryAllByTestId } = render(
      <Grenade duration={100} distance={100} start />,
    );

    let style!: Record<string, any>;

    await act(() => {
      jest.advanceTimersByTime(100);
      style = getAnimatedStyle(queryAllByTestId("circleModel")[0]);
    });

    expect(style.left).toBe(100);
  });

  it("Fragmentation should reach the maximum distance", async () => {
    const { queryAllByTestId } = render(
      <Grenade duration={100} fragments={4} distance={1000} start />,
    );

    let styles!: Record<string, any>[];

    await act(() => {
      jest.advanceTimersByTime(100);
      styles = queryAllByTestId("circleModel").map((fragment) =>
        getAnimatedStyle(fragment),
      );
    });

    // Anti-clockwise - starting from the right
    // Screen reference (Positive = Right/Down) (Negative = Left/Up)
    styles.forEach((style, index) => {
      switch (index) {
        case 0:
          expect(style.left).toBe(1000);
          expect(style.top).toBeGreaterThan(-5);
          expect(style.top).toBeLessThan(5);
          break;

        case 1:
          expect(style.top).toBe(-1000);
          expect(style.left).toBeGreaterThan(-5);
          expect(style.left).toBeLessThan(5);
          break;

        case 2:
          expect(style.left).toBe(-1000);
          expect(style.top).toBeGreaterThan(-5);
          expect(style.top).toBeLessThan(5);
          break;

        case 3:
          expect(style.top).toBe(1000);
          expect(style.left).toBeGreaterThan(-5);
          expect(style.left).toBeLessThan(5);
          break;
      }
    });
  });

  it("Should have a different initial position", () => {
    const { queryAllByTestId } = render(
      <Grenade duration={100} x={100} y={200} start={false} />,
    );

    queryAllByTestId("circleModel").forEach((fragment) => {
      const style = getAnimatedStyle(fragment);

      expect(style.top).toBe(200);
      expect(style.left).toBe(100);
    });
  });

  it("Should have a different initial size", () => {
    const { queryAllByTestId } = render(<Grenade size={500} start={false} />);

    queryAllByTestId("circleModel").forEach((fragment) => {
      const style = getAnimatedStyle(fragment);

      expect(style.width).toBe(500);
      expect(style.height).toBe(500);
    });
  });

  it("Should have more fragments", () => {
    const { queryAllByTestId } = render(
      <Grenade fragments={20} start={false} />,
    );

    expect(queryAllByTestId("circleModel").length).toBe(20);
  });

  it("Should repeat the animations", async () => {
    const { queryAllByTestId } = render(
      <Grenade duration={100} distance={100} start numbersOfReps={2} />,
    );

    let style!: Record<string, any>;

    await act(() => {
      jest.advanceTimersByTime(100);
      style = getAnimatedStyle(queryAllByTestId("circleModel")[0]);
    });

    expect(style.left).toBe(0);

    await act(() => {
      jest.advanceTimersByTime(100);
      style = getAnimatedStyle(queryAllByTestId("circleModel")[0]);
    });

    expect(style.left).toBe(100);
  });

  it("Should call onFinish when the animation finishes", () => {
    const callback = jest.fn(() => {});

    render(<Grenade duration={1000} onFinish={callback} start />);

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

  it("Should rotate the grenade", async () => {
    const { getByTestId } = render(
      <Grenade
        duration={1000}
        distance={1000}
        fragments={1}
        rotate={90}
        start
      />,
    );

    await waitFor(() =>
      act(() => {
        jest.advanceTimersByTime(1000);
      }),
    );

    const style = getAnimatedStyle(getByTestId("circleModel"));
    expect(style.top).toBe(1000);
  });

  it("Should delay the animation", async () => {
    const callback = jest.fn(() => {});
    render(<Grenade duration={1000} delay={1000} onFinish={callback} start />);

    await waitFor(() =>
      act(() => {
        jest.advanceTimersByTime(1000);
      }),
    );

    expect(callback).not.toHaveBeenCalled();

    await waitFor(() =>
      act(() => {
        jest.runAllTimers();
      }),
    );

    expect(callback).toHaveBeenCalled();
  });

  test.todo("Should delay the animation between repeats");
});
