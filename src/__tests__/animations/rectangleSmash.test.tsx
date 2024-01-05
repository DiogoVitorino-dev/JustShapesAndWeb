import { render, renderHook } from "@testing-library/react-native";
import { useWindowDimensions, ScaledSize } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { getAnimatedStyle } from "react-native-reanimated/src/reanimated2/jestUtils";

import {
  RectangleSmashAnimation,
  useRectangleSmashAnimation,
} from "@/animations/attacks/rectangleSmash";
import Rectangle, {
  RectanglePosition,
  RectangleSize,
  RectangleAngle,
} from "@/models/geometric/rectangle";

describe("Rectangle Smash Attack - Animation tests", () => {
  let anim: RectangleSmashAnimation;
  let pos: RectanglePosition;
  let size: RectangleSize;
  let angle: RectangleAngle;
  let dim: ScaledSize;

  beforeEach(() => {
    jest.useFakeTimers();

    renderHook(() => {
      pos = useSharedValue({ x: 0, y: 0 });
      size = useSharedValue({ width: 50, height: 50 });
      angle = useSharedValue(0);
      dim = useWindowDimensions();
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("Should run animation", () => {
    renderHook(() => {
      anim = useRectangleSmashAnimation(size);
    });

    const { root } = render(
      <Rectangle
        position={pos}
        size={size}
        angle={angle}
        style={anim.animatedStyle}
      />,
    );

    anim.run();
    jest.advanceTimersByTime(2150);

    const style = getAnimatedStyle(root);
    expect(style.width.toFixed(0)).toBe(dim.width.toString());
  });

  it("Should increment the size value according to the quantity and preparation time", () => {
    renderHook(() => {
      anim = useRectangleSmashAnimation(size, {
        prepareAmount: 500,
        prepareDuration: 1000,
        smashTo: "horizontal",
      });
    });

    const { root } = render(
      <Rectangle
        position={pos}
        size={size}
        angle={angle}
        style={anim.animatedStyle}
      />,
    );

    anim.run();
    jest.advanceTimersByTime(1000);

    let style = getAnimatedStyle(root);
    expect(style.width.toFixed(0)).toBe("550");

    jest.advanceTimersByTime(150);

    style = getAnimatedStyle(root);
    expect(style.width.toFixed(0)).toBe(dim.width.toString());
  });

  it("Should increment the size value according to the smash direction", () => {
    renderHook(() => {
      anim = useRectangleSmashAnimation(size, { smashTo: "vertical" });
    });

    const { root } = render(
      <Rectangle
        position={pos}
        size={size}
        angle={angle}
        style={anim.animatedStyle}
      />,
    );

    anim.run();
    jest.advanceTimersByTime(2150);

    const style = getAnimatedStyle(root);
    expect(style.height.toFixed(0)).toBe(dim.height.toString());
  });
});
