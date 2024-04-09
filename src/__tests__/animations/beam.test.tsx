import { act, render, renderHook } from "@testing-library/react-native";
import { useWindowDimensions } from "react-native";
import { getAnimatedStyle } from "react-native-reanimated/src/reanimated2/jestUtils";

import { Beam } from "@/animations/attacks/beam";

describe("Beam attack - Animation tests", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it("Should run animation", async () => {
    const { getByTestId } = render(
      <Beam beamDuration={500} prepareDuration={500} beamWidth={100} start />,
    );
    const view = getByTestId("rectangleModel");
    let style!: Record<string, any>;

    await act(() => {
      jest.advanceTimersByTime(500);
      style = getAnimatedStyle(view);
    });

    expect(style.height).toBeCloseTo(50);

    await act(() => {
      jest.advanceTimersByTime(500);
      style = getAnimatedStyle(view);
    });

    expect(style.height).toBeCloseTo(100);
  });

  it("Should render with correct initial values", async () => {
    const window = renderHook(() => useWindowDimensions());
    const { getByTestId } = render(
      <Beam beamWidth={100} angle={0} x={200} y={200} start={false} />,
    );
    const view = getByTestId("rectangleModel");
    const indicator = getByTestId("beamIndicator");

    const style = getAnimatedStyle(view);
    const indicatorStyle = getAnimatedStyle(indicator);

    expect(style.width).toBe(window.result.current.width);
    expect(style.height).toBe(0);
    expect(style.opacity).toBe(0);

    expect(indicatorStyle.width).toBe(window.result.current.width);
    expect(indicatorStyle.height).toBe(100);
    expect(indicatorStyle.opacity).toBe(0);
    expect(indicatorStyle.top).toBe(200);
    expect(indicatorStyle.left).toBe(200);
  });

  it("Should hide after the attack", async () => {
    const { getByTestId } = render(
      <Beam prepareDuration={500} beamDuration={500} beamWidth={100} start />,
    );
    const view = getByTestId("rectangleModel");
    const indicator = getByTestId("beamIndicator");

    let style!: Record<string, any>;
    let indicatorStyle!: Record<string, any>;

    await act(() => {
      jest.advanceTimersByTime(1500);
      style = getAnimatedStyle(view);
      indicatorStyle = getAnimatedStyle(indicator);
    });

    expect(style.height).toBe(0);
    expect(style.opacity).toBe(0);
    expect(indicatorStyle.opacity).toBe(0);
  });

  it("Should prepare the attack", async () => {
    const { getByTestId } = render(
      <Beam prepareDuration={500} beamWidth={100} start />,
    );
    const view = getByTestId("rectangleModel");
    const indicator = getByTestId("beamIndicator");

    let style = getAnimatedStyle(view);
    let indicatorStyle = getAnimatedStyle(indicator);

    await act(() => {
      jest.advanceTimersByTime(490);
      style = getAnimatedStyle(view);
      indicatorStyle = getAnimatedStyle(indicator);
    });

    expect(style.opacity).toBeCloseTo(0.7);
    expect(indicatorStyle.opacity).toBeCloseTo(0.2);

    await act(() => {
      jest.advanceTimersByTime(10);
      style = getAnimatedStyle(view);
    });

    expect(style.height).toBeCloseTo(100 / 2);
  });

  it("Should perform the attack", async () => {
    const { getByTestId } = render(
      <Beam prepareDuration={500} beamDuration={500} beamWidth={100} start />,
    );
    const view = getByTestId("rectangleModel");
    const indicator = getByTestId("beamIndicator");
    let indicatorStyle = getAnimatedStyle(indicator);
    let style = getAnimatedStyle(view);

    await act(() => {
      jest.advanceTimersByTime(1000);
      style = getAnimatedStyle(view);
      indicatorStyle = getAnimatedStyle(indicator);
    });

    expect(style.height).toBeCloseTo(100);
    expect(style.opacity).toBeCloseTo(1);
    expect(indicatorStyle.opacity).toBeCloseTo(0);
  });

  it("Should attack with correct attack speed", async () => {
    const { getByTestId } = render(
      <Beam prepareDuration={500} beamWidth={100} attackSpeed={500} start />,
    );
    const view = getByTestId("rectangleModel");

    let style = getAnimatedStyle(view);

    await act(() => {
      jest.advanceTimersByTime(500);
      style = getAnimatedStyle(view);
    });

    expect(style.height).toBeCloseTo(50);

    await act(() => {
      jest.advanceTimersByTime(500);
      style = getAnimatedStyle(view);
    });

    expect(style.height).toBeCloseTo(100);
  });

  it("Should call onFinish when the animation finishes", async () => {
    const callback = jest.fn(() => {});

    render(
      <Beam
        beamDuration={500}
        prepareDuration={500}
        onFinish={callback}
        start
      />,
    );

    await act(() => {
      jest.advanceTimersByTime(800);
    });

    expect(callback).not.toHaveBeenCalled();

    await act(() => {
      jest.runAllTimers();
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });
});
