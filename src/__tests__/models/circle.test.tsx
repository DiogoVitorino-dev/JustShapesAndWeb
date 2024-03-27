import { render, renderHook } from "@testing-library/react-native";
import { useSharedValue } from "react-native-reanimated";
import { getAnimatedStyle } from "react-native-reanimated/src/reanimated2/jestUtils";

import Circle, { CircleData } from "@/models/geometric/circle";

describe("Circle - Model tests", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("Should move a model", () => {
    const data = renderHook(() =>
      useSharedValue<CircleData>({
        x: 0,
        y: 0,
      }),
    );
    const { getByTestId } = render(<Circle data={data.result.current} />);

    const view = getByTestId("circleModel");

    data.result.current.value = { x: 50, y: 100 };

    jest.advanceTimersByTime(1000);

    expect(view).toHaveAnimatedStyle({
      left: 50,
      top: 100,
    });
  });

  it("Should change diameter", () => {
    const data = renderHook(() => useSharedValue<CircleData>({ diameter: 0 }));
    const { getByTestId } = render(<Circle data={data.result.current} />);

    data.result.current.value = { diameter: 90 };

    jest.advanceTimersByTime(1500);

    const style = getAnimatedStyle(getByTestId("circleModel"));

    expect(style.width).toStrictEqual(90);
    expect(style.height).toStrictEqual(90);
  });
});
