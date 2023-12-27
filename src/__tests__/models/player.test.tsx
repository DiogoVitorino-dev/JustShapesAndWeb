import { render, renderHook } from "@testing-library/react-native";
import { SharedValue, useSharedValue } from "react-native-reanimated";
import { getAnimatedStyle } from "react-native-reanimated/src/reanimated2/jestUtils";

import Player, { PlayerPosition } from "@/models/player";

describe("Player model - tests", () => {
  let pos: PlayerPosition;
  let angle: SharedValue<number>;

  beforeEach(() => {
    jest.useFakeTimers();

    renderHook(() => {
      pos = useSharedValue({ x: 0, y: 0 });
      angle = useSharedValue(0);
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should move a model", () => {
    const { getByTestId } = render(<Player angle={angle} position={pos} />);

    const view = getByTestId("playerModel");

    pos.value = { x: 50, y: 100 };

    angle.value = 90;

    jest.advanceTimersByTime(2000);

    expect(view).toHaveAnimatedStyle({
      left: 50,
      top: 100,
    });
  });

  it("should change angle", () => {
    const { getByTestId } = render(<Player angle={angle} position={pos} />);

    angle.value = 90;

    jest.advanceTimersByTime(2000);

    const style = getAnimatedStyle(getByTestId("playerModel"));

    expect(style.transform[0].rotate).toStrictEqual("90deg");
  });
});
