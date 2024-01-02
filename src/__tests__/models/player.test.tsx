import { render, renderHook } from "@testing-library/react-native";
import { useSharedValue } from "react-native-reanimated";
import { getAnimatedStyle } from "react-native-reanimated/src/reanimated2/jestUtils";

import Player, {
  PlayerAngle,
  PlayerPosition,
  PlayerSize,
} from "@/models/player";

describe("Player model - tests", () => {
  let pos: PlayerPosition;
  let size: PlayerSize;
  let angle: PlayerAngle;

  beforeEach(() => {
    jest.useFakeTimers();

    renderHook(() => {
      pos = useSharedValue({ x: 0, y: 0 });
      size = useSharedValue({ width: 50, height: 50 });
      angle = useSharedValue(0);
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("Should move a model", () => {
    const { getByTestId } = render(<Player angle={angle} position={pos} />);

    const view = getByTestId("playerModel");

    pos.value = { x: 50, y: 100 };

    angle.value = 90;

    jest.advanceTimersByTime(1000);

    expect(view).toHaveAnimatedStyle({
      left: 50,
      top: 100,
    });
  });

  it("Should change angle", () => {
    const { getByTestId } = render(<Player angle={angle} position={pos} />);

    angle.value = 90;

    jest.advanceTimersByTime(1500);

    const style = getAnimatedStyle(getByTestId("playerModel"));

    expect(style.transform[0].rotate).toStrictEqual("90deg");
  });

  it("Should change size", () => {
    const { getByTestId } = render(
      <Player angle={angle} position={pos} size={size} />,
    );

    size.value = { width: 100, height: 150 };

    jest.advanceTimersByTime(1000);

    const style = getAnimatedStyle(getByTestId("playerModel"));

    expect(style.width).toBe(100);
    expect(style.height).toBe(150);
  });
});
