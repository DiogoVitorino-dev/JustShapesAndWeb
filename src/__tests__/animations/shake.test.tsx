import { render } from "@testing-library/react-native";
import { getAnimatedStyle } from "react-native-reanimated/src/reanimated2/jestUtils";

import { Shake } from "@/animations/effects/shake";

describe("Shake effect - Animation tests", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it("Should run animation", () => {
    const { root } = render(
      <Shake duration={1000} amount={100} impact={{ frequency: 2 }} start />,
    );

    jest.advanceTimersByTime(800);

    let style = getAnimatedStyle(root);

    expect(style.transform[0].translateX).toBeGreaterThanOrEqual(-100);
    expect(style.transform[0].translateX).toBeLessThanOrEqual(100);
    expect(style.transform[0].translateX).not.toBe(0);

    expect(style.transform[1].translateY).toBeGreaterThanOrEqual(-100);
    expect(style.transform[1].translateY).toBeLessThanOrEqual(100);
    expect(style.transform[1].translateY).not.toBe(0);

    jest.runAllTimers();
    style = getAnimatedStyle(root);
    expect(style.transform[1].translateY).toBe(0);
    expect(style.transform[0].translateX).toBe(0);
  });

  it("Should only shake to LEFT edge on Horizontal axis", () => {
    const { root } = render(
      <Shake
        duration={1000}
        amount={100}
        impact={{ frequency: 2, horizontal: "start" }}
        start
      />,
    );

    jest.advanceTimersByTime(800);

    let style = getAnimatedStyle(root);

    expect(style.transform[0].translateX).toBeLessThan(0);
    expect(style.transform[0].translateX).toBeGreaterThanOrEqual(-100);

    jest.runAllTimers();
    style = getAnimatedStyle(root);
    expect(style.transform[0].translateX).toBe(0);
  });

  it("Should only shake to RIGHT edge on Horizontal axis", () => {
    const { root } = render(
      <Shake
        duration={1000}
        amount={100}
        impact={{ frequency: 2, horizontal: "end" }}
        start
      />,
    );

    jest.advanceTimersByTime(800);

    let style = getAnimatedStyle(root);

    expect(style.transform[0].translateX).toBeGreaterThan(0);
    expect(style.transform[0].translateX).toBeLessThanOrEqual(100);

    jest.runAllTimers();
    style = getAnimatedStyle(root);
    expect(style.transform[0].translateX).toBe(0);
  });

  it("Should only shake to TOP edge on Vertical axis", () => {
    const { root } = render(
      <Shake
        duration={1000}
        amount={100}
        impact={{ frequency: 2, vertical: "start" }}
        start
      />,
    );

    jest.advanceTimersByTime(800);

    let style = getAnimatedStyle(root);

    expect(style.transform[1].translateY).toBeLessThan(0);
    expect(style.transform[1].translateY).toBeGreaterThanOrEqual(-100);

    jest.runAllTimers();
    style = getAnimatedStyle(root);
    expect(style.transform[1].translateY).toBe(0);
  });

  it("Should only shake to BOTTOM edge on Vertical axis", () => {
    const { root } = render(
      <Shake
        duration={1000}
        amount={100}
        impact={{ frequency: 2, vertical: "end" }}
        start
      />,
    );

    jest.advanceTimersByTime(800);

    let style = getAnimatedStyle(root);

    expect(style.transform[1].translateY).toBeGreaterThan(0);
    expect(style.transform[1].translateY).toBeLessThanOrEqual(100);

    jest.runAllTimers();
    style = getAnimatedStyle(root);
    expect(style.transform[1].translateY).toBe(0);
  });

  it("Should call onFinish when the animation finishes", () => {
    const callback = jest.fn(() => {});

    render(<Shake duration={1000} onFinish={callback} start />);

    jest.advanceTimersByTime(800);
    expect(callback).not.toHaveBeenCalled();

    jest.runAllTimers();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("Should delay the animation", () => {
    const { root } = render(<Shake duration={1000} delay={1000} start />);

    jest.advanceTimersByTime(1000);
    const style = getAnimatedStyle(root);
    expect(style.transform[1].translateY).toBe(0);
    expect(style.transform[0].translateX).toBe(0);
  });

  it("Shouldn't shake on Vertical axis", () => {
    const { root } = render(
      <Shake duration={1000} impact={{ vertical: "none" }} start />,
    );

    jest.advanceTimersByTime(500);
    const style = getAnimatedStyle(root);
    expect(style.transform[1].translateY).toBe(0);
  });

  it("Shouldn't shake on Horizontal axis", () => {
    const { root } = render(
      <Shake duration={1000} impact={{ horizontal: "none" }} start />,
    );

    jest.advanceTimersByTime(500);
    const style = getAnimatedStyle(root);
    expect(style.transform[0].translateX).toBe(0);
  });
});
