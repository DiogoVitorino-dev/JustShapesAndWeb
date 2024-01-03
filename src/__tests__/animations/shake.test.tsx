import { render, renderHook } from "@testing-library/react-native";
import Animated from "react-native-reanimated";
import { getAnimatedStyle } from "react-native-reanimated/src/reanimated2/jestUtils";

import { ShakeAnimation, useShakeAnimation } from "@/animations/effects/shake";

describe("Shake effect - Animation tests", () => {
  let anim: ShakeAnimation;

  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it("Should run animation", () => {
    renderHook(() => {
      anim = useShakeAnimation(1000, 100, { duration: 500 });
    });

    const { root } = render(<Animated.View style={anim.animatedStyle} />);

    anim.run();
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
    renderHook(() => {
      anim = useShakeAnimation(1000, 100, {
        duration: 500,
        horizontal: "start",
      });
    });

    const { root } = render(<Animated.View style={anim.animatedStyle} />);

    anim.run();
    jest.advanceTimersByTime(800);

    let style = getAnimatedStyle(root);

    expect(style.transform[0].translateX).toBeLessThan(0);
    expect(style.transform[0].translateX).toBeGreaterThanOrEqual(-100);

    jest.runAllTimers();
    style = getAnimatedStyle(root);
    expect(style.transform[0].translateX).toBe(0);
  });

  it("Should only shake to RIGHT edge on Horizontal axis", () => {
    renderHook(() => {
      anim = useShakeAnimation(1000, 100, {
        duration: 500,
        horizontal: "end",
      });
    });

    const { root } = render(<Animated.View style={anim.animatedStyle} />);

    anim.run();
    jest.advanceTimersByTime(800);

    let style = getAnimatedStyle(root);

    expect(style.transform[0].translateX).toBeGreaterThan(0);
    expect(style.transform[0].translateX).toBeLessThanOrEqual(100);

    jest.runAllTimers();
    style = getAnimatedStyle(root);
    expect(style.transform[0].translateX).toBe(0);
  });

  it("Should only shake to TOP edge on Vertical axis", () => {
    renderHook(() => {
      anim = useShakeAnimation(1000, 100, {
        duration: 500,
        vertical: "start",
      });
    });

    const { root } = render(<Animated.View style={anim.animatedStyle} />);

    anim.run();
    jest.advanceTimersByTime(800);

    let style = getAnimatedStyle(root);

    expect(style.transform[1].translateY).toBeLessThan(0);
    expect(style.transform[1].translateY).toBeGreaterThanOrEqual(-100);

    jest.runAllTimers();
    style = getAnimatedStyle(root);
    expect(style.transform[1].translateY).toBe(0);
  });

  it("Should only shake to BOTTOM edge on Vertical axis", () => {
    renderHook(() => {
      anim = useShakeAnimation(1000, 100, {
        duration: 500,
        vertical: "end",
      });
    });

    const { root } = render(<Animated.View style={anim.animatedStyle} />);

    anim.run();
    jest.advanceTimersByTime(800);

    let style = getAnimatedStyle(root);

    expect(style.transform[1].translateY).toBeGreaterThan(0);
    expect(style.transform[1].translateY).toBeLessThanOrEqual(100);

    jest.runAllTimers();
    style = getAnimatedStyle(root);
    expect(style.transform[1].translateY).toBe(0);
  });
});
