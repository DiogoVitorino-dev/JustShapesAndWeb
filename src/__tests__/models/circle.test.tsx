import { render, renderHook } from "@testing-library/react-native";
import { useSharedValue } from "react-native-reanimated";
import { getAnimatedStyle } from "react-native-reanimated/src/reanimated2/jestUtils";

import Circle, {
  CirclePosition,
  CircleRadius,
} from "@/models/geometric/circle";

describe("Circle - Model tests", () => {
  let pos: CirclePosition;
  let radius: CircleRadius;

  beforeEach(() => {
    jest.useFakeTimers();

    renderHook(() => {
      pos = useSharedValue({ x: 0, y: 0 });
      radius = useSharedValue(50);
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("Should move a model", () => {
    const { getByTestId } = render(<Circle radius={radius} position={pos} />);

    const view = getByTestId("circleModel");

    pos.value = { x: 50, y: 100 };

    jest.advanceTimersByTime(1000);

    expect(view).toHaveAnimatedStyle({
      left: 50,
      top: 100,
    });
  });

  it("Should change radius", () => {
    const { getByTestId } = render(<Circle radius={radius} position={pos} />);

    radius.value = 90;

    jest.advanceTimersByTime(1500);

    const style = getAnimatedStyle(getByTestId("circleModel"));

    expect(style.width).toStrictEqual(90);
    expect(style.height).toStrictEqual(90);
  });
});
