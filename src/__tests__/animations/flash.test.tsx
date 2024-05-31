import { render } from "@testing-library/react-native";
import { getAnimatedStyle } from "react-native-reanimated/src/reanimated2/jestUtils";

import { Flash } from "@/animations/effects/flash";

describe("Shake effect - Animation tests", () => {
  const color = "#fff";

  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it("Should run animation", () => {
    const { getByTestId } = render(
      <Flash duration={1000} intensity={100} start />,
    );
    const view = getByTestId("flashAnimation");

    jest.advanceTimersByTime(500);
    let style = getAnimatedStyle(view);
    expect(style.opacity).toBeCloseTo(1);

    jest.advanceTimersByTime(500);
    style = getAnimatedStyle(view);
    expect(style.opacity).toBeCloseTo(0);
  });

  it("Should set intensity", () => {
    const { getByTestId } = render(
      <Flash duration={1000} intensity={20} start />,
    );
    const view = getByTestId("flashAnimation");

    jest.advanceTimersByTime(500);
    const style = getAnimatedStyle(view);
    expect(style.opacity).toBeCloseTo(0.2);
  });

  it("Should set a color", () => {
    const { getByTestId } = render(
      <Flash duration={1000} intensity={100} color={color} start />,
    );
    const view = getByTestId("flashAnimation");

    const style = getAnimatedStyle(view);
    expect(style.backgroundColor).toBe(color);
  });

  it("Should repeat the flash", () => {
    const { getByTestId } = render(
      <Flash duration={1000} intensity={100} numbersOfReps={2} start />,
    );
    const view = getByTestId("flashAnimation");

    jest.advanceTimersByTime(1500);
    let style = getAnimatedStyle(view);
    expect(style.opacity).toBeCloseTo(1);

    jest.runAllTimers();
    style = getAnimatedStyle(view);
    expect(style.opacity).toBe(0);
  });

  it("Should delay the animation", () => {
    const { getByTestId } = render(
      <Flash duration={1000} intensity={100} delay={500} start />,
    );
    const view = getByTestId("flashAnimation");

    jest.advanceTimersByTime(500);
    let style = getAnimatedStyle(view);
    expect(style.opacity).toBe(0);

    jest.advanceTimersByTime(500);
    style = getAnimatedStyle(view);
    expect(style.opacity).toBeCloseTo(1);
  });

  it("Should have delay between the repeats", () => {
    const { getByTestId } = render(
      <Flash
        duration={1000}
        intensity={100}
        numbersOfReps={2}
        delayOfReps={500}
        start
      />,
    );
    const view = getByTestId("flashAnimation");

    jest.advanceTimersByTime(2000);
    const style = getAnimatedStyle(view);
    expect(style.opacity).toBeCloseTo(1);
  });

  it("Should call onFinish when the animation finishes", () => {
    const callback = jest.fn(() => {});

    render(<Flash duration={1000} onFinish={callback} start />);

    jest.advanceTimersByTime(800);
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(200);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("Should call onFinish when the repeated animation finishes", () => {
    const callback = jest.fn(() => {});

    render(
      <Flash
        duration={1000}
        onFinish={callback}
        numbersOfReps={2}
        delayOfReps={500}
        start
      />,
    );

    jest.advanceTimersByTime(1500);
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(3000);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
